import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Rooms } from '@interfaces/rooms.interface';
import { Room } from '@models/rooms.model';
import { RoomService } from '@services/rooms.service';

export class RoomController {
  public room = Container.get(RoomService);

  public getRooms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const findAllRoomsData: Rooms[] = await this.room.findAllRoom({
        page: Number(page),
        limit: Number(limit),
      });

      res.status(200).json({ data: findAllRoomsData, message: 'findAll', page, limit });
    } catch (error) {
      next(error);
    }
  };

  public createRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roomData: Room = req.body;
      const createRoomData: Rooms = await this.room.createRoom(roomData);

      res.status(201).json({ data: createRoomData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}
