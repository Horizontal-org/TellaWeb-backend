import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { globalSettingControllers } from './controllers';
import {
  getByNameGlobalSettingServiceProvider,
  recordAnalyticsEventGlobalSettingServiceProvider,
  servicesGlobalSettingsProviders
} from './global-setting.provider';
import { GlobalSettingEntity } from './domain';

@Module({
  imports: [
    TypeOrmModule.forFeature([GlobalSettingEntity]), 
  ],
  controllers: [...globalSettingControllers],
  providers: [...servicesGlobalSettingsProviders],
  exports: [
    recordAnalyticsEventGlobalSettingServiceProvider
  ]
})
export class GlobalSettingModule {}
