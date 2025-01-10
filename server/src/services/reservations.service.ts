import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import { Reservations } from '@interfaces/reservations.interface';
import { ReservationModel, Reservation } from '@models/reservations.model';
import { GuestModel } from '@models/guests.model';
import { RoomModel } from '@models/rooms.model';

@Service()
export class ReservationService {
  public async findAllReservation({ page = 1, limit = 10 }): Promise<{
    reservations: Reservations[];
    totalPages: number;
  }> {
    if (limit > 100) throw new HttpException(400, 'Limit should be less than 100');
    if (page < 1) throw new HttpException(400, 'Page should be greater than 0');

    const reservations: Reservations[] = await ReservationModel.query()
      .select(
        'reservations.id',
        'reservations.start_date',
        'reservations.end_date',
        'guests.name as guest_name',
        'guests.email as guest_email',
        'guests.phone_number as guest_phone',
        ReservationModel.raw(
          `json_agg(json_build_object('room_id', rooms.id, 'room_number', rooms.room_number, room_name, rooms.room_name)) as rooms`,
        ),
      )
      .join('guests', 'reservations.guest_id', '=', 'guests.id')
      .join('reservation_rooms', 'reservations.id', '=', 'reservation_rooms.reservation_id')
      .join('rooms', 'reservation_rooms.room_id', '=', 'rooms.id')
      .groupBy('reservations.id', 'guests.id')
      .orderBy('reservations.start_date', 'asc')
      .limit(limit)
      .offset((page - 1) * limit);

    const totalReservationsResult = await ReservationModel.query().count('id as count').first();
    const totalReservations = Number(totalReservationsResult?.count ?? 0);
    const totalPages = Math.ceil(totalReservations / limit);

    return {
      reservations,
      totalPages,
    };
  }

  public async ValidateDates({ startDate, endDate }: { startDate: string; endDate: string }): Promise<void> {
    if (new Date(startDate) > new Date(endDate)) {
      throw new HttpException(400, 'End date should be greater than start date');
    }
    if (new Date(startDate) < new Date()) {
      throw new HttpException(400, 'Start date should be greater than today');
    }
  }

  public async validateGuest({ guestId }: { guestId: number }): Promise<void> {
    const guest = await GuestModel.query().findById(guestId);
    if (!guest) {
      throw new HttpException(404, 'Guest not found');
    }
  }

  public async validateRooms({ roomIds }: { roomIds: number[] }): Promise<void> {
    const rooms = await RoomModel.query().whereIn('id', roomIds);
    if (rooms.length !== roomIds.length) {
      throw new HttpException(404, 'Some rooms do not exist');
    }
  }

  public async checkRoomAvailability({ roomIds, startDate, endDate }: { roomIds: number[]; startDate: string; endDate: string }): Promise<void> {
    for (const roomId of roomIds) {
      const overlappingReservations = await ReservationModel.query()
        .join('reservation_rooms', 'reservation_rooms.reservation_id', '=', 'reservations.id')
        .where('reservation_rooms.room_id', roomId)
        .where(builder =>
          builder.whereBetween('reservations.start_date', [startDate, endDate]).orWhereBetween('reservations.end_date', [startDate, endDate]),
        )
        .forUpdate();

      if (overlappingReservations.length > 0) {
        const { room_number } = await RoomModel.query().findById(roomId).select('room_number').first();
        if (!room_number) {
          throw new HttpException(404, 'Room not found');
        }
        throw new HttpException(409, `Room ${room_number} is already reserved for the selected dates.`);
      }
    }
  }

  public async createReservation({ reservationData }: { reservationData: Reservation }): Promise<number> {
    const { guest_id, start_date, end_date, room_id } = reservationData;

    const updatedEndDate = new Date(end_date);
    updatedEndDate.setDate(updatedEndDate.getDate() + 1);
    const updatedStartDate = new Date(start_date);
    updatedStartDate.setDate(updatedStartDate.getDate() + 1);

    return ReservationModel.transaction(async trx => {
      // Insert reservation
      const [reservationId] = await trx('reservations')
        .insert({ guest_id: guest_id, start_date: updatedStartDate, end_date: updatedEndDate })
        .returning('id');

      // Insert room mappings
      const reservationRooms = room_id.map(roomId => ({
        reservation_id: reservationId.id || reservationId,
        room_id: roomId,
      }));
      console.log('reservationRooms', reservationRooms);
      await trx('reservation_rooms').insert(reservationRooms);

      return reservationId;
    });
  }

  public async cancelReservation({ reservationId }: { reservationId: number }): Promise<void> {
    const reservation = await ReservationModel.query().findById(reservationId);
    if (!reservation) {
      throw new HttpException(404, 'Reservation not found');
    }

    await ReservationModel.query().deleteById(reservationId);
  }

  public async getMonthlyReservations({ year, month }: { year: number; month: number }): Promise<{
    days: {
      date: string;
      reservationCount: number;
      reservations: {
        id: number;
        start_date: string;
        end_date: string;
        room_number: string;
        guest_name: string;
      }[];
    }[];
  }> {
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      throw new HttpException(400, 'Invalid year or month');
    }

    const startOfMonth = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endOfMonth = new Date(year, month, 0).toISOString().split('T')[0];

    // Fetch reservations within the month
    const reservations = await ReservationModel.query()
      .select('reservations.id', 'reservations.start_date', 'reservations.end_date', 'rooms.room_number', 'guests.name as guest_name')
      .leftJoin('reservation_rooms', 'reservations.id', 'reservation_rooms.reservation_id')
      .leftJoin('rooms', 'reservation_rooms.room_id', 'rooms.id')
      .leftJoin('guests', 'reservations.guest_id', 'guests.id')
      .where('reservations.start_date', '<=', endOfMonth)
      .andWhere('reservations.end_date', '>=', startOfMonth);

    // Generate a calendar with reservation counts for each day
    const days: Record<string, { date: string; reservationCount: number; reservations: any[] }> = {};

    for (let day = 1; day <= new Date(year, month, 0).getDate(); day++) {
      const date = new Date(year, month - 1, day).toISOString().split('T')[0];
      days[date] = { date, reservationCount: 0, reservations: [] };
    }

    reservations.forEach(reservation => {
      const { start_date, end_date } = reservation;

      const start = new Date(start_date);
      const end = new Date(end_date);

      for (let d = start; d <= end && d.getMonth() + 1 === month; d.setDate(d.getDate() + 1)) {
        const date = d.toISOString().split('T')[0];
        if (days[date]) {
          days[date].reservationCount += 1;
          days[date].reservations.push(reservation);
        }
      }
    });

    return {
      days: Object.values(days),
    };
  }
}
