import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import { Rooms } from '@interfaces/rooms.interface';
import { Room, RoomModel } from '@models/rooms.model';

@Service()
export class RoomService {
  public async findAllRoom({ page = 1, limit = 10 }): Promise<Rooms[]> {
    const rooms: Rooms[] = await RoomModel.query()
      .select('id', 'room_name', 'room_number')
      .from('rooms')
      .offset(Number((page - 1) * limit))
      .limit(Number(limit));

    return rooms;
  }

  public async createRoom(roomData: Room): Promise<Rooms> {
    const findRoom: Rooms = await RoomModel.query().select().from('rooms').where('room_number', '=', roomData.room_number).first();
    if (findRoom) throw new HttpException(409, `This room number ${roomData.room_number} already exists`);

    const createRoomData: Rooms = await RoomModel.query()
      .insert({ ...roomData })
      .into('rooms');

    return createRoomData;
  }
}
