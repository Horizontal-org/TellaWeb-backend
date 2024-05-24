import { Body, Inject, Param, Post, UseGuards } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import { OnlyAuthor } from 'modules/report/guard/only-author.report.guard';

import { TYPES, ICloseFileApplication } from '../interfaces';
import { TYPES as GLOBAL_SETTINGS_TYPES, IRecordAnalyticsEventGlobalSettingService } from '../../globalSettings/interfaces';
import { CloseFileDto } from '../dto';
import { RolesUser } from 'modules/user/domain';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

@AuthController('file', [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER, RolesUser.REPORTER], JwtTypes.ALL)
export class CloseFileReportController {
  constructor(
    @Inject(TYPES.applications.ICloseFileApplication)
    private readonly closeFileApplication: ICloseFileApplication,
    @Inject(GLOBAL_SETTINGS_TYPES.services.IRecordAnalyticsEventGlobalSettingService)
    private readonly recordAnalyticsService: IRecordAnalyticsEventGlobalSettingService,
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

    await this.recordAnalyticsService.execute({
      measurement: true,
      timePrecision: 300,
      type: 'count',
      id: 'MyApPucrtpDkJWoNHh_DHiXDSEQ7cH5s9Bl3GDPJfXg'
    })

    return {
      success: true
    }
  }
}
