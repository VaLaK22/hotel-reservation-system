import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import { Guests } from '@interfaces/guests.interface';
import { GuestModel, Guest } from '@models/guests.model';

@Service()
export class GuestService {
  public async findAllGuest({ page = 1, limit = 10 }): Promise<Guests[]> {
    if (limit > 100) throw new HttpException(400, 'Limit should be less than 100');
    if (page < 1) throw new HttpException(400, 'Page should be greater than 0');

    const guests: Guests[] = await GuestModel.query()
      .select('id', 'name', 'phone_number', 'email')
      .from('guests')
      .offset(Number((page - 1) * limit))
      .limit(Number(limit));

    return guests;
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

  public async getGuestById({ guestId }: { guestId: number }): Promise<Guests> {
    const findGuest: Guests = await GuestModel.query().select('id', 'name', 'phone_number', 'email').from('guests').where('id', '=', guestId).first();
    if (!findGuest) throw new HttpException(409, `Guest was not found`);

    return findGuest;
  }
}
