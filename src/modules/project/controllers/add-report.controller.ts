import { Body, Inject, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import { CreateReportDto, ReadReportDto } from '../../report/dto';
import { ICreateReportApplication, TYPES as REPORT_TYPES } from '../../report/interfaces';
import { ReadProjectDto } from '../dto';

import { LoggedUser } from 'modules/auth/decorators';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { ReadUserDto } from 'modules/user/dto';

@AuthController('project', [], JwtTypes.ALL, 'id')
export class AddReportProjectController {
  constructor(
    @Inject(REPORT_TYPES.applications.ICreateReportApplication)
    private createReportApplication: ICreateReportApplication,
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
    
    return report;
  }
}
