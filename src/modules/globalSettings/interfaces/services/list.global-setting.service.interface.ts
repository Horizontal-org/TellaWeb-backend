import { PartialResult } from 'common/dto/partial-result.common.dto';

import { ReadResourceDto } from 'modules/resource/dto';
import { PaginatedDto } from 'common/dto/paginated.common.dto';
import { ReadGlobalSettingDto } from 'modules/globalSettings/dto/read.global-setting.dto';

export interface IListGlobalSettingService {
  execute(): Promise<ReadGlobalSettingDto[]>;
}
