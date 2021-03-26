import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

export const OrmConfig: SqliteConnectionOptions = {
  type: 'sqlite',
  database: './tellaDb.sql',
  synchronize: true,
};
