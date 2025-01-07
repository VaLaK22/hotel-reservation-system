import { Router } from 'express';
import { RoomController } from '@/controllers/rooms.controller';
import { Routes } from '@interfaces/routes.interface';
import { validate } from '@middlewares/validate';
import { RoomSchema } from '@models/rooms.model';

export class RoomRoute implements Routes {
  public path = '/rooms';
  public router = Router();
  public room = new RoomController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.room.getRooms);
    this.router.post(`${this.path}`, validate(RoomSchema), this.room.createRoom);
  }
}
