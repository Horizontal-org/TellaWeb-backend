import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';

dotenv.config({ quiet: true });

// Shared by the Nest app (app.module.ts) and the TypeORM CLI (data-source.ts)
export const OrmConfig: DataSourceOptions = {
  type: 'mysql',
  // 'db' for prod
  host: process.env.MYSQL_HOST || 'db',
  port: +process.env.MYSQL_PORT || 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: false,
  migrationsRun: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  entities: [__dirname + '/modules/**/domain/*.entity{.ts,.js}'],
  // TypeORM 0.3 drops a where condition whose value is undefined or null, so
  // findOne({ where: { id: undefined } }) would return the first row. Fail instead.
  invalidWhereValuesBehavior: { undefined: 'throw', null: 'throw' },
};

export default OrmConfig;
