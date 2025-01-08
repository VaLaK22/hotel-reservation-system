import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import { Guests } from '@interfaces/guests.interface';
import { GuestModel, Guest } from '@models/guests.model';
import { ReservationModel } from '@/models/reservations.model';
import { Reservations } from '@/interfaces/reservations.interface';

@Service()
export class GuestService {
  public async findAllGuest({ page = 1, limit = 10 }): Promise<{
    guests: Guests[];
    totalPages: number;
  }> {
    if (limit > 100) throw new HttpException(400, 'Limit should be less than 100');
    if (page < 1) throw new HttpException(400, 'Page should be greater than 0');

    const guests: Guests[] = await GuestModel.query()
      .select('guests.id', 'guests.name', 'guests.phone_number', 'guests.email')
      .from('guests')
      .offset(Number((page - 1) * limit))
      .limit(Number(limit));

    const totalGuestsResult = await GuestModel.query().count('id as count').first();
    const totalGuests = Number(totalGuestsResult?.count ?? 0);
    const totalPages = Math.ceil(totalGuests / limit);

    return {
      guests,
      totalPages,
    };
  }

  public async createGuest({ guestData }: { guestData: Guest }): Promise<Guests> {
    const findGuest: Guests = await GuestModel.query().select().from('guests').where('phone_number', '=', guestData.phone_number).first();
    if (findGuest) throw new HttpException(409, `This phone number ${guestData.phone_number} already exists`);

    const createGuestData: Guests = await GuestModel.query()
      .insert({ ...guestData })
      .into('guests');

    return createGuestData;
  }

  public async updateGuest({ guestId, guestData }: { guestId: number; guestData: Guest }): Promise<Guests> {
    const findGuest: Guests = await GuestModel.query().select().from('guests').where('id', '=', guestId).first();
    if (!findGuest) throw new HttpException(409, `Guest was not found`);
    await GuestModel.query()
      .update({ ...guestData })
      .from('guests')
      .where('id', '=', guestId);

    const updateGuestData: Guests = await GuestModel.query()
      .select('id', 'name', 'phone_number', 'email')
      .from('guests')
      .where('id', '=', guestId)
      .first();
    return updateGuestData;
  }

  public async getGuestById({ guestId }: { guestId: number }): Promise<{
    findGuest: Guests;
    upcomingReservations: Reservations[];
    pastReservationsCount: number;
  }> {
    const findGuest: Guests = await GuestModel.query().select('id', 'name', 'phone_number', 'email').from('guests').where('id', '=', guestId).first();
    if (!findGuest) throw new HttpException(409, `Guest was not found`);

    const upcomingReservations: Reservations[] = await ReservationModel.query()
      .select(
        'reservations.id',
        'reservations.start_date',
        'reservations.end_date',
        GuestModel.raw(`json_agg(json_build_object('room_id', rooms.id, 'room_number', rooms.room_number, room_name, rooms.room_name)) as rooms`),
      )
      .join('reservation_rooms', 'reservations.id', '=', 'reservation_rooms.reservation_id')
      .join('rooms', 'reservation_rooms.room_id', '=', 'rooms.id')
      .groupBy('reservations.id')
      .orderBy('reservations.start_date', 'asc')
      .where('reservations.guest_id', '=', guestId)
      .andWhere('reservations.end_date', '>=', ReservationModel.fn.now());

    const pastReservationsCount = await ReservationModel.query()
      .count('id as count')
      .where('guest_id', '=', guestId)
      .andWhere('end_date', '<', ReservationModel.fn.now())
      .first();

    return { findGuest, upcomingReservations, pastReservationsCount: Number(pastReservationsCount?.count ?? 0) };
  }
}
