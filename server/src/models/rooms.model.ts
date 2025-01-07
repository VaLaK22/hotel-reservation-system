import { Type, Static } from '@sinclair/typebox';

import { Model, ModelObject } from 'objection';
import { Rooms } from '@interfaces/rooms.interface';

export class RoomModel extends Model implements Rooms {
  id!: number;
  room_name!: string;
  room_number!: number;
  count?: number;
  static tableName = 'rooms'; // database table name
  static idColumn = 'id'; // id column name
}

export type RoomShape = ModelObject<RoomModel>;

// Room schema
export const RoomSchema = Type.Object({
  room_name: Type.String({ minLength: 1 }),
  room_number: Type.Integer({ minimum: 1 }),
});

export const RoomIdSchema = Type.Object({
  id: Type.Integer({ minimum: 1 }),
});

// Reuse schema types for API and database
export type Room = Static<typeof RoomSchema>;
export type RoomId = Static<typeof RoomIdSchema>;
