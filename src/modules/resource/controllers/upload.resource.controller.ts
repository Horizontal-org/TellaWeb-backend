import { BadRequestException, Inject, Param, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';

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
  @ApiBadRequestResponse({ description: 'The file is not a PDF' })
  @Put('upload/:fileName')
  async handler(
    @Req() stream: Request,
    @Param('fileName') fileName: string,
  ): Promise<ReadResourceDto> {
    // Rejected before the body is read; the service still checks the content
    if (!/\.pdf$/i.test(fileName)) {
      throw new BadRequestException('Only PDF files can be uploaded');
    }

    const file = await this.uploadResourceService.execute({
      bucket: 'resources',
      fileName,
      stream,
    });

    return file;
  }
}
