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
  UsePipes,
} from '@nestjs/common';
import { ValidationPipe } from 'src/common/validation.pipe';
import { ReportDomain } from '../domain/report.domain';
import { ICreateReportApplication } from '../interfaces/applications/create.report.application.interface';
import { IGetByIdReportApplication } from '../interfaces/applications/get-by-id.report.application.interface';
import { TYPES } from '../interfaces/types';
import { TYPES as TYPES_FILES } from 'src/files/interfaces/types';
import { Request, Response } from 'express';
import { ICreateFileApplicationInterface } from 'src/files/interfaces/applications/create.file.application.interface';
import { IAddFileReportService } from '../interfaces/services/add-file.report.service.interface';
import { IGetByNameAndBucketFileApplication } from 'src/files/interfaces/applications/get-by-name-and-bucket.file.application';
import { ICloseFileApplication } from 'src/files/interfaces/applications/close.file.application.interface';
import { ReportNotFound } from '../exceptions/report-not-found';

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
    private createFileApplication: ICreateFileApplicationInterface,
    @Inject(TYPES.services.IAddFileReportService)
    private readonly addFileReportService: IAddFileReportService,
    @Inject(TYPES_FILES.applications.ICloseFileApplication)
    private readonly closeFileApplication: ICloseFileApplication,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('/create')
  async createReportHandler(@Body() reportDomain: ReportDomain) {
    const report = await this.createReportApplication.execute(reportDomain);
    return report;
  }

  @Get(':id')
  async findReportHandler(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.getByIdReportApplication.execute(id);
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
