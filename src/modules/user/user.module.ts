import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from 'nestjs-console';

import { ReportModule } from 'modules/report/report.module';
import { AbilityModule } from 'casl/casl.module';

import { UserCommander } from './commander';
import { UserEntity } from './domain';
import {
  applicationsUserProviders,
  servicesUserProviders,
  checkPasswordUserApplicationProvider,
  getByIdUserApplicationProvider,
  makePublicUserApplicationProvider,
} from './user.providers';
import { userControllers } from './controllers';
import { ProjectModule } from 'modules/project/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConsoleModule,
    ReportModule,
    AbilityModule,
    forwardRef(() => ProjectModule),
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
    makePublicUserApplicationProvider,
  ],
})
export class UserModule {}
