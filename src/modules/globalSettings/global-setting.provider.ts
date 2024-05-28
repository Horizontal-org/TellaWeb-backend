import { TYPES } from './interfaces';

import { GetByNameGlobalSettingService } from './services/get-by-name.global-setting.service';
import { ListGlobalSettingService } from './services/list.global-setting.service';
import { UpdateGlobalSettingService } from './services/update.global-setting.service';
import { RecordAnalyticsEventGlobalSettingService } from './services/record-analytics-event.service'

export const listGlobalSettingServiceProvider = {
  provide: TYPES.services.IListGlobalSettingService,
  useClass: ListGlobalSettingService,
};

export const updateGlobalSettingServiceProvider = {
  provide: TYPES.services.IUpdateGlobalSettingService,
  useClass: UpdateGlobalSettingService
}

export const getByNameGlobalSettingServiceProvider = {
  provide: TYPES.services.IGetByNameGlobalSettingService,
  useClass: GetByNameGlobalSettingService
}

export const recordAnalyticsEventGlobalSettingServiceProvider = {
  provide: TYPES.services.IRecordAnalyticsEventGlobalSettingService,
  useClass: RecordAnalyticsEventGlobalSettingService
}

export const servicesGlobalSettingsProviders = [
  listGlobalSettingServiceProvider,
  updateGlobalSettingServiceProvider,
  getByNameGlobalSettingServiceProvider,
  recordAnalyticsEventGlobalSettingServiceProvider
];
