import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ReadUserDto } from 'modules/user/dto';

import {
  ReadRemoteConfigurationDto,
  CreateRemoteConfigurationDto,
} from '../dto';
import {
  TYPES,
  ICreateRemoteConfigurationApplication,
  ICreateRemoteConfigurationService,
} from '../interfaces';

@Injectable()
export class CreateRemoteConfigurationApplication
  implements ICreateRemoteConfigurationApplication {
  constructor(
    @Inject(TYPES.services.ICreateRemoteConfigurationService)
    private readonly createRemoteConfigurationService: ICreateRemoteConfigurationService,
  ) {}

  async execute(
    createRemoteConfigurationDto: CreateRemoteConfigurationDto,
  ): Promise<ReadRemoteConfigurationDto> {
    const configuration = await this.createRemoteConfigurationService.execute(
      createRemoteConfigurationDto,
    );
    return plainToClass(ReadRemoteConfigurationDto, configuration);
  }
}
