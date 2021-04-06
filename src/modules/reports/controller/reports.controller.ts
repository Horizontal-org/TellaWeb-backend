import {
  Body,
  Controller,
  Get,
  Head,
  Inject,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

import {
  TYPES as TYPES_FILES,
  ICreateFileApplication,
  ICloseFileApplication,
  IGetByNameAndBucketFileApplication,
} from 'modules/files/interfaces';

//import { UserEntity } from 'modules/user/domain';
import { RolesUserGuard } from 'modules/user/guard/roles.user.guard';
import { Roles } from 'modules/user/decorators/roles.user.decorator';
import { RolesUser } from 'modules/user/domain';

//import { LoggedUser } from 'modules/auth/decorators';

import { ReadReportDto } from '../dto';
import { ReportNotFound } from '../exceptions';
import {
  TYPES,
  ICreateReportApplication,
  IGetByIdReportApplication,
} from '../interfaces';

@Controller('reports')
@UseGuards(RolesUserGuard)
@UseGuards(AuthGuard('basic'))
export class ReportsController {
  constructor(
    @Inject(TYPES.applications.ICreateReportApplication)
    private createReportApplication: ICreateReportApplication,
    @Inject(TYPES.applications.IGetByIdReportApplication)
    private getByIdReportApplication: IGetByIdReportApplication,
    @Inject(TYPES_FILES.applications.IGetByNameAndBucketFileApplication)
    private getByNameAndBucketFileApplication: IGetByNameAndBucketFileApplication,
    @Inject(TYPES_FILES.applications.ICreateFileApplication)
    private createFileApplication: ICreateFileApplication,
    @Inject(TYPES_FILES.applications.ICloseFileApplication)
    private readonly closeFileApplication: ICloseFileApplication,
  ) {}

  @Roles(RolesUser.ADMIN)
  @Get(':reportId')
  async findReportHandler(@Param('reportId') reportId: string) {
    return this.getByIdReportApplication.execute(reportId);
  }

  @Head(':reportId/:fileName')
  async getFileSizeHandler(
    @Res() res: Response,
    @Param('reportId') reportId: string,
    @Param('fileName') fileName: string,
  ) {
    const fileInfo = await this.getByNameAndBucketFileApplication.execute({
      bucket: reportId,
      fileName: fileName,
    });
    res.setHeader('size', fileInfo.size || 0);
    res.send();
  }

  @Put(':reportId/:fileName')
  async addFileHandler(
    @Req() stream: Request,
    @Param('reportId') reportId: string,
    @Param('fileName') fileName: string,
  ) {
    const file = await this.createFileApplication.execute({
      bucket: reportId,
      fileName,
      stream,
    });

    return file;
  }

  @Post(':reportId/:fileName')
  async closeFileHandler(
    @Param('reportId') reportId: string,
    @Param('fileName') fileName: string,
  ) {
    const report = await this.getByIdReportApplication.execute(reportId);
    if (!report) throw new ReportNotFound(reportId);

    await this.closeFileApplication.execute({
      fileName,
      bucket: reportId,
    });

    // todo add file to report

    return;
  }

  @Post('')
  async createReportHandler(
    @Body() reportDomain: ReadReportDto,
    //@LoggedUser() user: UserEntity,
  ) {
    const report = await this.createReportApplication.execute({
      ...reportDomain,
    });

    //Todo add report to user
    return report;
  }
}
