import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import {
  ReadRemoteConfigurationDto,
  CreateRemoteConfigurationDto,
} from '../dto';
import {
  TYPES,
  ICreateRemoteConfigurationApplication,
  ICreateRemoteConfigurationService,
} from '../interfaces';

import {
  IMakePublicUserApplication,
  TYPES as TYPES_USER,
} from '../../user/interfaces';

@Injectable()
export class CreateRemoteConfigurationApplication
  implements ICreateRemoteConfigurationApplication {
  constructor(
    @Inject(TYPES.services.ICreateRemoteConfigurationService)
    private readonly createRemoteConfigurationService: ICreateRemoteConfigurationService,
    @Inject(TYPES_USER.applications.IMakePublicUserApplication)
    private readonly makePublicUserApplication: IMakePublicUserApplication,
  ) {}

  async execute(
    createRemoteConfigurationDto: CreateRemoteConfigurationDto,
  ): Promise<ReadRemoteConfigurationDto> {
    // if (createRemoteConfigurationDto.defaultUser)
    //   await this.makePublicUserApplication.execute(
    //     createRemoteConfigurationDto.defaultUser,
    //   );

    const configuration = await this.createRemoteConfigurationService.execute(
      createRemoteConfigurationDto,
    );
    return plainToClass(ReadRemoteConfigurationDto, configuration);
  }
}
