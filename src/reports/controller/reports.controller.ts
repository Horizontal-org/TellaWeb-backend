import {
  Body,
  Controller,
  Get,
  Head,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ReportDomain } from '../domain/report.domain';
import { ICreateReportApplication } from '../interfaces/applications/create.report.application.interface';
import { IGetByIdReportApplication } from '../interfaces/applications/get-by-id.report.application.interface';
import { TYPES } from '../interfaces/types';
import { TYPES as TYPES_FILES } from 'files/interfaces/types';
import { Request, Response } from 'express';
import { ICreateFileApplication } from 'files/interfaces/applications/create.file.application.interface';
import { IAddFileReportService } from '../interfaces/services/add-file.report.service.interface';
import { IGetByNameAndBucketFileApplication } from 'files/interfaces/applications/get-by-name-and-bucket.file.application';
import { ICloseFileApplication } from 'files/interfaces/applications/close.file.application.interface';
import { ReportNotFound } from '../exceptions/report-not-found';
import { AuthGuard } from '@nestjs/passport';
import { RolesUserGuard } from 'user/guard/roles.user.guard';
import { Roles } from 'user/decorators/roles.user.decorator';
import { UserRoles } from 'user/domain/user-roles.enum';

@Controller('reports')
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
    @Inject(TYPES.services.IAddFileReportService)
    private readonly addFileReportService: IAddFileReportService,
    @Inject(TYPES_FILES.applications.ICloseFileApplication)
    private readonly closeFileApplication: ICloseFileApplication,
  ) {}

  @UseGuards(AuthGuard('basic'))
  @Post('/create')
  async createReportHandler(@Body() reportDomain: ReportDomain) {
    const report = await this.createReportApplication.execute(reportDomain);
    return report;
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesUserGuard)
  @UseGuards(AuthGuard('basic'))
  @Get(':id')
  async findReportHandler(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.getByIdReportApplication.execute(id);
  }

  @UseGuards(AuthGuard('basic'))
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

  @UseGuards(AuthGuard('basic'))
  @Put(':reportId/:fileName')
  async addFileHandler(
    @Req() stream: Request,
    @Param('reportId') reportId: string,
    @Param('fileName') fileName: string,
  ) {
    const report = await this.getByIdReportApplication.execute(reportId);
    if (!report) throw new ReportNotFound(reportId);

    const file = await this.createFileApplication.execute({
      bucket: reportId,
      fileName,
      stream,
    });

    await this.addFileReportService.execute({
      fileId: file.id,
      reportId: reportId,
    });

    return;
  }

  @UseGuards(AuthGuard('basic'))
  @Post(':reportId/:fileName')
  async closeFileHandler(
    @Param('reportId') reportId: string,
    @Param('fileName') fileName: string,
  ) {
    const report = await this.getByIdReportApplication.execute(reportId);
    if (!report) throw new ReportNotFound(reportId);

    await this.closeFileApplication.execute({ fileName, bucket: reportId });
    return;
  }
}
