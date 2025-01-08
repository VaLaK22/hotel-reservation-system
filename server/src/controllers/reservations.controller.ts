import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Reservations } from '@interfaces/reservations.interface';
import { Reservation } from '@models/reservations.model';
import { ReservationService } from '@services/reservations.service';

export class ReservationController {
  public reservation = Container.get(ReservationService);

  public getReservations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const findAllReservationsData: {
        reservations: Reservations[];
        totalPages: number;
      } = await this.reservation.findAllReservation({
        page: Number(page),
        limit: Number(limit),
      });

      res
        .status(200)
        .json({ data: findAllReservationsData.reservations, message: 'findAll', page, limit, totalPages: findAllReservationsData.totalPages });
    } catch (error) {
      next(error);
    }
  };

  public createReservation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reservationData: Reservation = req.body;

      await this.reservation.ValidateDates({
        startDate: reservationData.start_date,
        endDate: reservationData.end_date,
      });
      await this.reservation.validateGuest({
        guestId: reservationData.guest_id,
      });

      // Validate rooms
      await this.reservation.validateRooms({
        roomIds: reservationData.room_id,
      });

      // Check room availability
      await this.reservation.checkRoomAvailability({
        roomIds: reservationData.room_id,
        startDate: reservationData.start_date,
        endDate: reservationData.end_date,
      });

      // Create reservation
      const reservationId = await this.reservation.createReservation({
        reservationData,
      });

      res.status(200).json({ data: reservationId, message: 'created' });
    } catch (error: any) {
      next(error);
    }
  };

  public cancelReservation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reservationId = Number(req.params.id);

      await this.reservation.cancelReservation({
        reservationId,
      });

      res.status(200).json({ message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
