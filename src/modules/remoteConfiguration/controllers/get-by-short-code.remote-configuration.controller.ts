import { Get, Inject, Param } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import { ApiResponse } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { ReadRemoteConfigurationDto } from '../dto/read.remote-configuration.dto';
import {
  IGetByShortCodeRemoteConfigurationApplication,
  TYPES
} from '../interfaces';

@AuthController('config', [], JwtTypes.WEB)
export class GetByShortCodeRemoteConfigurationController {
  constructor(
    @Inject(TYPES.applications.IGetByShortCodeRemoteConfigurationApplication)
    private readonly getByShortCode: IGetByShortCodeRemoteConfigurationApplication,
  ) {}

  @ApiResponse({ type: ReadRemoteConfigurationDto })
  @Get('shortcode/:shortcode')
  async handler(
    @Param('shortcode') shortCode: string,
  ): Promise<ReadRemoteConfigurationDto> {
    const configuration = await this.getByShortCode.execute(shortCode);
    return plainToClass(ReadRemoteConfigurationDto, configuration);
  }
}
