import { Body, Inject, Post } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import { LoggedUser } from 'modules/auth/decorators';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { ReadUserDto } from 'modules/user/dto';

import { CreateReportDto, ReadReportDto } from '../dto';
import { ICreateReportApplication, TYPES } from '../interfaces';

@AuthController('report', [], JwtTypes.ALL)
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
