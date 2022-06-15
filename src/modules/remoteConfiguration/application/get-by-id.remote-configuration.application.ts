import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { ReadRemoteConfigurationDto } from '../dto';
import { NotFoundRemoteConfigurationException } from '../exceptions';
import {
  TYPES,
  IGetByIdRemoteConfigurationApplication,
  IGetByIdRemoteConfigurationService,
} from '../interfaces';

@Injectable()
export class GetByIdRemoteConfigurationApplication implements IGetByIdRemoteConfigurationApplication {
  constructor(
    @Inject(TYPES.services.IGetByIdRemoteConfigurationService)
    private getByIdRemoteConfigurationService: IGetByIdRemoteConfigurationService,
  ) {}

  async execute(id: string): Promise<ReadRemoteConfigurationDto> {
    const remoteConfig = await this.getByIdRemoteConfigurationService.execute(id);
    if (!remoteConfig) throw new NotFoundRemoteConfigurationException(id);

    return plainToClass(ReadRemoteConfigurationDto, remoteConfig);
  }
}
