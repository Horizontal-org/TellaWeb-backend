import {
  BadRequestException,
  Headers,
  Inject,
  Param,
  PayloadTooLargeException,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiPayloadTooLargeResponse,
} from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import { ReadResourceDto } from '../dto';
import { TYPES, IUploadResourceService } from '../interfaces';
import { MAX_RESOURCE_SIZE } from '../domain';
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
  @ApiPayloadTooLargeResponse({ description: 'The file exceeds 20 MB' })
  @Put('upload/:fileName')
  async handler(
    @Req() stream: Request,
    @Param('fileName') fileName: string,
    @Headers('content-length') contentLength?: string,
  ): Promise<ReadResourceDto> {
    // Rejected before the body is read; the service still checks the content
    if (!/\.pdf$/i.test(fileName)) {
      throw new BadRequestException('Only PDF files can be uploaded');
    }

    // Header can be missing or wrong; the service also caps the body
    if (parseInt(contentLength, 10) > MAX_RESOURCE_SIZE) {
      throw new PayloadTooLargeException('File exceeds the 20 MB limit');
    }

    const file = await this.uploadResourceService.execute({
      bucket: 'resources',
      fileName,
      stream,
    });

    return file;
  }
}
