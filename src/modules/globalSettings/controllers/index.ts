import { ListGlobalSettingController } from './list.global-setting.controller';
import { UpdateGlobalSettingController } from './update.global-setting.controller';
import { GetByNameGlobalSettingController } from './get-by-name-global-setting.controller'

export const globalSettingControllers = [
  GetByNameGlobalSettingController,
  ListGlobalSettingController,
  UpdateGlobalSettingController,
];
