import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const OrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  // 'db' for prod 
  host: process.env.MYSQL_HOST,
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: false,
  migrationsRun: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  entities: [__dirname + '/modules/**/domain/*.entity{.ts,.js}'],
  cli: {
    migrationsDir: './src/migrations',
  },
};

export default OrmConfig;
