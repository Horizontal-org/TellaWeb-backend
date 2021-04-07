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
} from './user.providers';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConsoleModule,
    ReportModule,
  ],

  providers: [
    UserCommander,
    ...applicationsUserProviders,
    ...servicesUserProviders,
  ],
  exports: [checkPasswordUserApplicationProvider],
})
export class UserModule {}
