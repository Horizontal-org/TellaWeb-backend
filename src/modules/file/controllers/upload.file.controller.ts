import { Inject, Param, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ApiCreatedResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import { OnlyAuthor } from 'modules/report/guard/only-author.report.guard';

import { FileDto } from '../dto';
import { TYPES, ICreateFileApplication } from '../interfaces';
import { RolesUser } from 'modules/user/domain';

@AuthController('file', [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER, RolesUser.REPORTER])
export class UploadFileReportController {
  constructor(
    @Inject(TYPES.applications.ICreateFileApplication)
    private createFileApplication: ICreateFileApplication,
  ) {}

  @ApiCreatedResponse({ type: FileDto })
  @UseGuards(OnlyAuthor)
  @Put(':reportId/:fileName')
  async handler(
    @Req() stream: Request,
    @Param('reportId') reportId: string,
    @Param('fileName') fileName: string,
  ): Promise<FileDto> {
    const file = await this.createFileApplication.execute({
      bucket: reportId,
      fileName,
      stream,
    });

    return file;
  }
}
