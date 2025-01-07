import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Rooms } from '@interfaces/rooms.interface';
import { Room } from '@models/rooms.model';
import { RoomService } from '@services/rooms.service';

export class RoomController {
  public room = Container.get(RoomService);

  public getRooms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = 1, limit = 10, sort } = req.query;

      const findAllRoomsData: { rooms: Rooms[]; totalPages: number } = await this.room.findAllRoom({
        page: Number(page),
        limit: Number(limit),
        sort: sort,
      });

      res.status(200).json({ data: findAllRoomsData.rooms, message: 'findAll', page, limit, totalPages: findAllRoomsData.totalPages });
    } catch (error) {
      next(error);
    }
  };

  public createRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roomData: Room = req.body;
      const createRoomData: Rooms = await this.room.createRoom({
        roomData,
      });

      res.status(201).json({ data: createRoomData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roomId = Number(req.params.id);
      const roomData: Room = req.body;
      const updateRoomData: Rooms = await this.room.updateRoom({
        roomId,
        roomData,
      });

      res.status(200).json({ data: updateRoomData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public getRoomById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roomId = Number(req.params.id);
      const roomData: Rooms = await this.room.getRoomById({ roomId });

      res.status(200).json({ data: roomData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };
}
