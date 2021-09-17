import { Get, Inject, Param } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import { RolesUser } from 'modules/user/domain';
import {
  IGetByShortCodeRemoteConfigurationApplication,
  TYPES,
} from '../interfaces';
import { RemoteConfigurationReadDto } from '../dto/remote-configuration-read.dto';
import { ApiResponse } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

@AuthController('config', [RolesUser.ADMIN, RolesUser.USER])
export class GetByShortCodeRemoteConfigurationController {
  constructor(
    @Inject(TYPES.applications.IGetByShortCodeRemoteConfigurationApplication)
    private readonly getByShortCode: IGetByShortCodeRemoteConfigurationApplication,
  ) {}

  @ApiResponse({ type: RemoteConfigurationReadDto })
  @Get('shortcode/:shortcode')
  async handler(
    @Param('shortcode') shortCode: string,
  ): Promise<RemoteConfigurationReadDto> {
    const configuration = await this.getByShortCode.execute(shortCode);
    return plainToClass(RemoteConfigurationReadDto, configuration);
  }
}
