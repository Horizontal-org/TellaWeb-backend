import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

export const OrmConfig: SqliteConnectionOptions = {
  type: 'sqlite',
  database: './tellaDb.sql',
  synchronize: true,
  migrationsRun: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: './src/migrations',
  },
};

export default OrmConfig;
