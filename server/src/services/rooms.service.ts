import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import { Rooms } from '@interfaces/rooms.interface';
import { Room, RoomModel } from '@models/rooms.model';

@Service()
export class RoomService {
  public async findAllRoom({ page = 1, limit = 10, sort = 'room_number' }): Promise<Rooms[]> {
    if (limit > 100) throw new HttpException(400, 'Limit should be less than 100');
    if (page < 1) throw new HttpException(400, 'Page should be greater than 0');
    if (!['room_name', 'room_number'].includes(sort)) throw new HttpException(400, 'Sort should be either room_name or room_number');
    const rooms: Rooms[] = await RoomModel.query()
      .select('id', 'room_name', 'room_number')
      .from('rooms')
      .orderBy(sort)
      .offset(Number((page - 1) * limit))
      .limit(Number(limit));

    return rooms;
  }

  public async createRoom({ roomData }: { roomData: Room }): Promise<Rooms> {
    const findRoom: Rooms = await RoomModel.query().select().from('rooms').where('room_number', '=', roomData.room_number).first();
    if (findRoom) throw new HttpException(409, `This room number ${roomData.room_number} already exists`);

    const createRoomData: Rooms = await RoomModel.query()
      .insert({ ...roomData })
      .into('rooms');

    return createRoomData;
  }
}
