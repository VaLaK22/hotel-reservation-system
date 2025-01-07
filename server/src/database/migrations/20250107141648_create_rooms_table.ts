import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('rooms', table => {
    table.increments('id').primary();
    table.string('room_name').notNullable();
    table.integer('room_number').unique().notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('rooms');
}
