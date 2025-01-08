import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import { Rooms } from '@interfaces/rooms.interface';
import { Room, RoomModel } from '@models/rooms.model';
import { ReservationModel } from '@/models/reservations.model';

@Service()
export class RoomService {
  public async findAllRoom({
    page = 1,
    limit = 10,
    sort = 'room_number',
  }: {
    page: number;
    limit: number;
    sort?: any;
  }): Promise<{ rooms: Rooms[]; totalPages: number }> {
    const sortDirection = sort === 'room_number' ? 'asc' : 'desc';

    if (limit > 100) throw new HttpException(400, 'Limit should be less than 100');
    if (page < 1) throw new HttpException(400, 'Page should be greater than 0');

    if (!['room_name', 'room_number', 'total_reservations'].includes(sort))
      throw new HttpException(400, 'Sort should be either room_name or room_number');

    const rooms = await RoomModel.query()
      .select('rooms.id', 'rooms.room_number', 'rooms.room_name', RoomModel.knex().raw(`COALESCE(COUNT(reservations.id), 0) AS total_reservations`))
      .leftJoin('reservation_rooms', 'rooms.id', 'reservation_rooms.room_id')
      .leftJoin('reservations', join => {
        join.on('reservation_rooms.reservation_id', '=', 'reservations.id').andOn('reservations.end_date', '>=', RoomModel.knex().fn.now());
      })
      .groupBy('rooms.id')
      .orderBy(
        sort === 'total_reservations' ? RoomModel.knex().raw('total_reservations') : sort === 'room_name' ? 'rooms.room_name' : 'rooms.room_number',
        sortDirection,
      )
      .limit(limit)
      .offset((page - 1) * limit);

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

  public async getRoomById({ roomId }: { roomId: number }): Promise<{
    id: number;
    room_name: string;
    room_number: number;
    currentReservation: {
      id: number;
      start_date: string;
      end_date: string;
    } | null;
    upcomingReservations: {
      id: number;
      start_date: string;
      end_date: string;
    }[];
  }> {
    const findRoom: Rooms = await RoomModel.query().select('id', 'room_name', 'room_number').from('rooms').where('id', '=', roomId).first();
    if (!findRoom) throw new HttpException(409, `This room id ${roomId} does not exist`);

    const currentReservation = await ReservationModel.query()
      .select('reservations.id', 'reservations.start_date', 'reservations.end_date', 'guests.name as guest_name')
      .leftJoin('reservation_rooms', 'reservations.id', 'reservation_rooms.reservation_id')
      .leftJoin('guests', 'reservations.guest_id', 'guests.id')
      .where('reservation_rooms.room_id', roomId)
      .andWhere('reservations.start_date', '<=', ReservationModel.fn.now())
      .andWhere('reservations.end_date', '>=', ReservationModel.fn.now())
      .first();

    // Fetch upcoming reservations
    const upcomingReservations = await ReservationModel.query()
      .select('reservations.id', 'reservations.start_date', 'reservations.end_date', 'guests.name as guest_name')
      .leftJoin('reservation_rooms', 'reservations.id', 'reservation_rooms.reservation_id')
      .leftJoin('guests', 'reservations.guest_id', 'guests.id')
      .where('reservation_rooms.room_id', roomId)
      .andWhere('reservations.start_date', '>', ReservationModel.fn.now())
      .orderBy('reservations.start_date', 'asc');

    return {
      ...findRoom,
      currentReservation,
      upcomingReservations,
    };
  }
}
