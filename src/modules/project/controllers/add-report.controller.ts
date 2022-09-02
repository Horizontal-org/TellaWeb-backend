import { Body, Inject, Post, ParseUUIDPipe, Param, Put } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { RolesUser } from 'modules/user/domain';
import { plainToClass } from 'class-transformer';

import { CreateReportDto, ReadReportDto } from '../../report/dto';
import { EditProjectDto, ReadProjectDto } from '../dto';
import { TYPES as REPORT_TYPES, ICreateReportApplication } from '../../report/interfaces';
import { TYPES, IEditProjectApplication } from '../interfaces';

import { LoggedUser } from 'modules/auth/decorators';
import { ReadUserDto } from 'modules/user/dto';

@AuthController('project')
export class AddReportProjectController {
  constructor(
    @Inject(REPORT_TYPES.applications.ICreateReportApplication)
    private createReportApplication: ICreateReportApplication,
    @Inject(TYPES.applications.IEditProjectApplication)
    private editProjectApplication: IEditProjectApplication,
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
