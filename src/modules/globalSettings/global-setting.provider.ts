import { TYPES } from './interfaces';

import { ListGlobalSettingService } from './services/list.global-setting.service';
// import { UploadResourceService } from './services/upload.resource.service';

export const listGlobalSettingServiceProvider = {
  provide: TYPES.services.IListGlobalSettingService,
  useClass: ListGlobalSettingService,
};

// export const uploadResourceServiceProvider = {
//   provide: TYPES.services.IUploadResourceService,
//   useClass: UploadResourceService
// }

export const servicesGlobalSettingsProviders = [
  listGlobalSettingServiceProvider,
];
