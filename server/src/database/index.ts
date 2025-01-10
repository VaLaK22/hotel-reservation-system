import { Model } from 'objection';
import Knex from 'knex';
import { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE } from '@config';

export const dbConnection = async () => {
  const dbConfig = {
    client: 'pg',
    connection: {
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      timezone: 'UTC',
    },
    pool: {
      min: 2,
      max: 10,
    },
  };

  await Model.knex(Knex(dbConfig));
};
