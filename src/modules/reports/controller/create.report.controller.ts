import { Body, Inject, Post } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';

//import { UserEntity } from 'modules/user/domain';
//import { LoggedUser } from 'modules/auth/decorators';

import { CreateReportDto, ReadReportDto } from '../dto';
import { TYPES, ICreateReportApplication } from '../interfaces';

@AuthController('reports')
export class CreateReportController {
  constructor(
    @Inject(TYPES.applications.ICreateReportApplication)
    private createReportApplication: ICreateReportApplication,
  ) {}

  @ApiCreatedResponse({ type: ReadReportDto })
  @Post('')
  async handler(
    @Body() reportDomain: CreateReportDto,
    //@LoggedUser() user: UserEntity,
  ) {
    const report = await this.createReportApplication.execute({
      ...reportDomain,
    });

    //Todo add report to user
    return report;
  }
}
