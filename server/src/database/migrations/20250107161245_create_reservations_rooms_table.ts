import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('reservation_rooms', table => {
    table.increments('id').primary();
    table.integer('reservation_id').unsigned().notNullable().references('id').inTable('reservations').onDelete('CASCADE');
    table.integer('room_id').unsigned().notNullable().references('id').inTable('rooms').onDelete('CASCADE');
    table.unique(['reservation_id', 'room_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('reservation_rooms');
}
