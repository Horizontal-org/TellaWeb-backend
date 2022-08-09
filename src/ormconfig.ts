import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

export const OrmConfig: SqliteConnectionOptions = {
  type: 'sqlite',
  database: './db/tellaDb.sql',
  synchronize: false,
  migrationsRun: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  entities: [__dirname + '/modules/**/domain/*.entity{.ts,.js}'],
  cli: {
    migrationsDir: './src/migrations',
  },
};

export default OrmConfig;
