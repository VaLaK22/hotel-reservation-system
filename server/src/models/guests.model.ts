import { Type, Static } from '@sinclair/typebox';

import { Model, ModelObject } from 'objection';
import { Guests } from '@interfaces/guests.interface';

export class GuestModel extends Model implements Guests {
  id!: number;
  name!: string;
  email!: string;
  phone_number!: string;

  count?: number;
  static tableName = 'guests'; // database table name
  static idColumn = 'id'; // id column name
}

export type UserShape = ModelObject<GuestModel>;

// Guest schema
export const GuestSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  email: Type.String(),
  phone_number: Type.String({ minLength: 10, maxLength: 15 }),
});

export const GuestIdSchema = Type.Object({
  id: Type.Integer({ minimum: 1 }),
});

// Reuse schema types for API and database
export type Guest = Static<typeof GuestSchema>;
export type GuestId = Static<typeof GuestIdSchema>;
