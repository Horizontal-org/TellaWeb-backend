import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { EditRemoteConfigurationDto, ReadRemoteConfigurationDto } from '../dto';
import {
  IEditRemoteConfigurationApplication,
  IEditRemoteConfigurationService,
  TYPES,
} from '../interfaces';

@Injectable()
export class EditRemoteConfigurationApplication
  implements IEditRemoteConfigurationApplication {
  constructor(
    @Inject(TYPES.services.IEditRemoteConfigurationService)
    private readonly editRemoteConfigurationService: IEditRemoteConfigurationService,
  ) {}

  async execute(
    editRemoteConfigurationDto: EditRemoteConfigurationDto,
  ): Promise<ReadRemoteConfigurationDto> {
    const RemoteConfiguration = await this.editRemoteConfigurationService.execute(
      editRemoteConfigurationDto,
    );
    return plainToClass(ReadRemoteConfigurationDto, RemoteConfiguration, {
      excludeExtraneousValues: true,
    });
  }
}
