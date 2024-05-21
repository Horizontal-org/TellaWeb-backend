import { TYPES } from './interfaces';

import { ListGlobalSettingService } from './services/list.global-setting.service';
import { UpdateGlobalSettingService } from './services/update.global-setting.service';

export const listGlobalSettingServiceProvider = {
  provide: TYPES.services.IListGlobalSettingService,
  useClass: ListGlobalSettingService,
};

export const updateGlobalSettingServiceProvider = {
  provide: TYPES.services.IUpdateGlobalSettingService,
  useClass: UpdateGlobalSettingService
}

export const servicesGlobalSettingsProviders = [
  listGlobalSettingServiceProvider,
  updateGlobalSettingServiceProvider
];
