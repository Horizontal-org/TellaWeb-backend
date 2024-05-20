import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PartialResult } from 'common/dto/partial-result.common.dto';

import { GlobalSettingEntity } from '../domain';
import { IListGlobalSettingService } from '../interfaces';
import { PaginatedDto } from 'common/dto/paginated.common.dto';
import { plainToClass } from 'class-transformer';
import { ReadGlobalSettingDto } from '../dto/read.global-setting.dto';

@Injectable()
export class ListGlobalSettingService implements IListGlobalSettingService {
  constructor(
    @InjectRepository(GlobalSettingEntity)
    private readonly globalSettingsRepo: Repository<GlobalSettingEntity>,
  ) {}

  async execute(): Promise<ReadGlobalSettingDto[]> {

    const globalSettings = await this.globalSettingsRepo
      .createQueryBuilder('global_settings')
      .getMany()
      

    return globalSettings.map((g) => plainToClass(ReadGlobalSettingDto, g));
  }
}
