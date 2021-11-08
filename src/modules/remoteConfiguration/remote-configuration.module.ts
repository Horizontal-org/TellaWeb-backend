import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from 'nestjs-console';

import { ReportModule } from 'modules/report/report.module';

import { RemoteConfigurationEntity } from './domain';
import { remoteConfigurationControllers } from './controllers';

import {
  applicationsRemoteConfigurationProviders,
  servicesRemoteConfigurationProviders,
} from './remote-configuration.providers';
import { UserModule } from 'modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RemoteConfigurationEntity]),
    ConsoleModule,
    ReportModule,
    UserModule,
  ],
  controllers: [...remoteConfigurationControllers],
  providers: [
    ...applicationsRemoteConfigurationProviders,
    ...servicesRemoteConfigurationProviders,
  ],
  exports: [],
})
export class RemoteConfigurationModule {}
