import { Router } from 'express';
import { GuestController } from '@/controllers/guests.controller';
import { Routes } from '@interfaces/routes.interface';
import { validate } from '@middlewares/validate';
import { GuestSchema } from '@models/guests.model';

export class GuestRoute implements Routes {
  public path = '/guests';
  public router = Router();
  public guest = new GuestController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.guest.getGuests);
    this.router.post(`${this.path}`, validate(GuestSchema), this.guest.createUser);
    this.router.put(`${this.path}/:id`, validate(GuestSchema), this.guest.updateUser);
    this.router.get(`${this.path}/:id`, this.guest.getUserById);
  }
}
