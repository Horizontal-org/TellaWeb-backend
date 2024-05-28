import { ReadGlobalSettingDto } from 'modules/globalSettings/dto/read.global-setting.dto';

export interface IGetByNameGlobalSettingService {
  execute(name: string): Promise<ReadGlobalSettingDto>;
}
