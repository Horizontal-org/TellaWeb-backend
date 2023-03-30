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
  checkSuspiciousApplicationProvider,
} from './user.providers';
import { userControllers } from './controllers';
import { ProjectModule } from 'modules/project/project.module';
import { UserVerificationCodeEntity } from './domain/user-verification-code.entity';
import { UserWhitelistEntity } from './domain/user-whitelist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([UserVerificationCodeEntity]),
    TypeOrmModule.forFeature([UserWhitelistEntity]),
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
    checkSuspiciousApplicationProvider
  ],
})
export class UserModule {}
