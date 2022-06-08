import { Body, Inject, Post } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import { LoggedUser } from 'modules/auth/decorators';
import { RolesUser } from 'modules/user/domain';
import { ReadUserDto } from 'modules/user/dto';

import { CreateReportDto, ReadReportDto } from '../dto';
import { TYPES, ICreateReportApplication } from '../interfaces';

@AuthController('report', [RolesUser.REPORTER, RolesUser.ADMIN])
export class CreateReportController {
  constructor(
    @Inject(TYPES.applications.ICreateReportApplication)
    private createReportApplication: ICreateReportApplication,
  ) {}

  @ApiCreatedResponse({ type: ReadReportDto })
  @Post('')
  async handler(
    @Body() createReportDto: CreateReportDto,
    @LoggedUser() author: ReadUserDto,
  ): Promise<ReadReportDto> {
    const report = await this.createReportApplication.execute(
      createReportDto,
      author,
    );

    //Todo add report to user
    return report;
  }
}
