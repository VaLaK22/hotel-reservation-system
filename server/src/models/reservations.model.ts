import { Type, Static } from '@sinclair/typebox';

import { Model, ModelObject } from 'objection';
import { Reservations } from '@interfaces/reservations.interface';

export class ReservationModel extends Model implements Reservations {
  id!: number;
  guest_id!: number;
  room_id!: number[];
  start_date!: string;
  end_date!: string;

  count?: number;
  static tableName = 'reservations'; // database table name
  static idColumn = 'id'; // id column name
}

export type ReservationShape = ModelObject<ReservationModel>;

// Guest schema
export const ReservationSchema = Type.Object({
  guest_id: Type.Integer({ minimum: 1 }),
  room_id: Type.Array(Type.Integer({ minimum: 1 })),
  start_date: Type.String(),
  end_date: Type.String(),
});

export const ReservationIdSchema = Type.Object({
  id: Type.Integer({ minimum: 1 }),
});

// Reuse schema types for API and database
export type Reservation = Static<typeof ReservationSchema>;
export type ReservationId = Static<typeof ReservationIdSchema>;
