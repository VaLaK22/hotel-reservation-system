import { Router } from 'express';
import { ReservationController } from '@/controllers/reservations.controller';
import { Routes } from '@interfaces/routes.interface';
import { validate } from '@middlewares/validate';
import { ReservationSchema } from '@models/reservations.model';

export class ReservationIRoute implements Routes {
  public path = '/reservations';
  public router = Router();
  public reservation = new ReservationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.reservation.getReservations);
    this.router.post(`${this.path}`, validate(ReservationSchema), this.reservation.createReservation);
    this.router.delete(`${this.path}/:id`, this.reservation.cancelReservation);
  }
}
