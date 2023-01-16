import { Body, Inject, Param, Post, UseGuards } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import { OnlyAuthor } from 'modules/report/guard/only-author.report.guard';

import { TYPES, ICloseFileApplication } from '../interfaces';
import { CloseFileDto } from '../dto';
import { RolesUser } from 'modules/user/domain';

@AuthController('file', [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER, RolesUser.REPORTER])
export class CloseFileReportController {
  constructor(
    @Inject(TYPES.applications.ICloseFileApplication)
    private readonly closeFileApplication: ICloseFileApplication,
  ) {}

  @UseGuards(OnlyAuthor)
  @Post(':reportId/:fileName')
  async handler(
    @Param('reportId') reportId: string,
    @Param('fileName') fileName: string,
    @Body() closeFileDto: CloseFileDto
  ) {

    closeFileDto.fileName = fileName
    closeFileDto.bucket = reportId

    try {
      await this.closeFileApplication.execute(
        closeFileDto,
        reportId,
      )
    } catch (err) {      
      return {
        success: false
      }
    }

    return {
      success: true
    }
  }
}
