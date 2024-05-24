import { Body, Inject, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import { CreateReportDto, ReadReportDto } from '../../report/dto';
import { ICreateReportApplication, TYPES as REPORT_TYPES } from '../../report/interfaces';
import { ReadProjectDto } from '../dto';

import { LoggedUser } from 'modules/auth/decorators';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { ReadUserDto } from 'modules/user/dto';
import { TYPES as GLOBAL_SETTINGS_TYPES, IRecordAnalyticsEventGlobalSettingService } from '../../globalSettings/interfaces';

@AuthController('project', [], JwtTypes.ALL, 'id')
export class AddReportProjectController {
  constructor(
    @Inject(REPORT_TYPES.applications.ICreateReportApplication)
    private createReportApplication: ICreateReportApplication,
    @Inject(GLOBAL_SETTINGS_TYPES.services.IRecordAnalyticsEventGlobalSettingService)
    private readonly recordAnalyticsService: IRecordAnalyticsEventGlobalSettingService,
  ) {}

  @ApiResponse({ type: ReadProjectDto })
  @Post(':projectId')
  async handler(
    @Body() createReportDto: CreateReportDto,
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @LoggedUser() author: ReadUserDto,
  ): Promise<ReadReportDto> {    
    
    createReportDto.projectId = projectId
    const report = await this.createReportApplication.execute(createReportDto, author);
    
    await this.recordAnalyticsService.execute({
      measurement: true,
      timePrecision: 300,
      type: 'count',
      id: 'KrZxm9_NFLR7szNcysg84COGDVjl1M2lUKoIiDCgws4'
    })

    return report;
  }
}
