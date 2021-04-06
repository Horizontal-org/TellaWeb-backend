import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from 'nestjs-console';

import { OrmConfig } from './ormconfig';

import { UserModule } from 'modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReportsModule } from './modules/reports/reports.module';
import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...OrmConfig,
      autoLoadEntities: true,
    }),
    ConsoleModule,
    UserModule,
    ReportsModule,
    FilesModule,
    AuthModule,
  ],
})
export class AppModule {}
