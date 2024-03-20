import { Inject, Param, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ApiCreatedResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';


import { ReadResourceDto } from '../dto';
import { TYPES, IUploadResourceService } from '../interfaces';
import { RolesUser } from 'modules/user/domain';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

@AuthController('resource', [RolesUser.ADMIN], JwtTypes.WEB)
export class UploadResourceController {
  constructor(
    @Inject(TYPES.services.IUploadResourceService)
    private uploadResourceService: IUploadResourceService,
  ) {}

  @ApiCreatedResponse({ type: ReadResourceDto })
  @Put('upload/:fileName')
  async handler(
    @Req() stream: Request,
    @Param('fileName') fileName: string,
  ): Promise<ReadResourceDto> {
    
    const file = await this.uploadResourceService.execute({
      bucket: 'resources',
      fileName,
      stream
    })

    return file;
  }
}
