import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Guests } from '@interfaces/guests.interface';
import { Guest } from '@models/guests.model';
import { GuestService } from '@services/guests.service';

export class GuestController {
  public guest = Container.get(GuestService);

  public getGuests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const findAllGuestsData: Guests[] = await this.guest.findAllGuest({
        page: Number(page),
        limit: Number(limit),
      });

      res.status(200).json({ data: findAllGuestsData, message: 'findAll', page, limit });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const guestData: Guest = req.body;
      const createGuestData: Guests = await this.guest.createGuest(guestData);

      res.status(201).json({ data: createGuestData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const guestId = Number(req.params.id);
      const guestData: Guest = req.body;
      const updateGuestData: Guests = await this.guest.updateGuest(guestId, guestData);

      res.status(200).json({ data: updateGuestData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const guestId = Number(req.params.id);
      const findOneGuestData: Guests = await this.guest.getGuestById(guestId);

      res.status(200).json({ data: findOneGuestData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };
}
