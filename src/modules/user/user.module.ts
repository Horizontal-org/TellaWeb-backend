import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from 'nestjs-console';

import { ReportModule } from 'modules/report/report.module';

import { UserCommander } from './commander';
import { UserEntity } from './domain';
import {
  applicationsUserProviders,
  servicesUserProviders,
  checkPasswordUserApplicationProvider,
  getByIdUserApplicationProvider,
} from './user.providers';
import { userControllers } from './controllers';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConsoleModule,
    ReportModule,
  ],
  controllers: [...userControllers],
  providers: [
    UserCommander,
    ...applicationsUserProviders,
    ...servicesUserProviders,
  ],
  exports: [
    checkPasswordUserApplicationProvider,
    getByIdUserApplicationProvider,
  ],
})
export class UserModule {}
