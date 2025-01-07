import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import { Rooms } from '@interfaces/rooms.interface';
import { Room, RoomModel } from '@models/rooms.model';

@Service()
export class RoomService {
  public async findAllRoom({
    page = 1,
    limit = 10,
    sort = 'room_name',
  }: {
    page: number;
    limit: number;
    sort?: any;
  }): Promise<{ rooms: Rooms[]; totalPages: number }> {
    console.log('sort', sort);
    if (limit > 100) throw new HttpException(400, 'Limit should be less than 100');
    if (page < 1) throw new HttpException(400, 'Page should be greater than 0');
    if (!['room_name', 'room_number'].includes(sort)) throw new HttpException(400, 'Sort should be either room_name or room_number');

    const rooms: Rooms[] = await RoomModel.query()
      .select('id', 'room_name', 'room_number')
      .from('rooms')
      .orderBy(sort, 'asc')
      .offset(Number((page - 1) * limit))
      .limit(Number(limit));

    const totalRoomsResult = await RoomModel.query().count('id as count').first();
    const totalRooms = Number(totalRoomsResult?.count ?? 0);
    const totalPages = Math.ceil(totalRooms / limit);

    // Calculate the total number of pages

    return {
      rooms,
      totalPages,
    };
  }

  public async createRoom({ roomData }: { roomData: Room }): Promise<Rooms> {
    const findRoom: Rooms = await RoomModel.query().select().from('rooms').where('room_number', '=', roomData.room_number).first();
    if (findRoom) throw new HttpException(409, `This room number ${roomData.room_number} already exists`);

    const createRoomData: Rooms = await RoomModel.query()
      .insert({ ...roomData })
      .into('rooms');

    return createRoomData;
  }

  public async updateRoom({ roomId, roomData }: { roomId: number; roomData: Room }): Promise<Rooms> {
    const findRoom: Rooms = await RoomModel.query().select().from('rooms').where('id', '=', roomId).first();
    if (!findRoom) throw new HttpException(409, `This room id ${roomId} does not exist`);

    const duplicateRoom: Rooms = await RoomModel.query()
      .select()
      .from('rooms')
      .where('room_number', '=', roomData.room_number)
      .andWhere('id', '!=', roomId)
      .first();
    if (duplicateRoom) throw new HttpException(409, `This room number ${roomData.room_number} already exists`);

    await RoomModel.query()
      .update({ ...roomData })
      .from('rooms')
      .where('id', '=', roomId);

    const updateRoomData: Rooms = await RoomModel.query().select().from('rooms').where('id', '=', roomId).first();

    return updateRoomData;
  }

  public async getRoomById({ roomId }: { roomId: number }): Promise<Rooms> {
    const findRoom: Rooms = await RoomModel.query().select('id', 'room_name', 'room_number').from('rooms').where('id', '=', roomId).first();
    if (!findRoom) throw new HttpException(409, `This room id ${roomId} does not exist`);

    return findRoom;
  }
}
