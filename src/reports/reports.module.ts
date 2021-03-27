import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './domain/report.entity';
import { ReportsController } from './controller/reports.controller';
import { ReportFile } from './domain/report-files.entity';
import { FilesModule } from 'files/files.module';
import {
  createReportApplicationProvider,
  getByIdReportApplicationProvider,
  createReportServiceProvider,
  getByIdServiceProvider,
  addFileReportServiceProvider,
} from './reports.providers';

@Module({
  imports: [TypeOrmModule.forFeature([Report, ReportFile]), FilesModule],
  controllers: [ReportsController],
  providers: [
    createReportApplicationProvider,
    getByIdReportApplicationProvider,
    createReportServiceProvider,
    getByIdServiceProvider,
    addFileReportServiceProvider,
  ],
})
export class ReportsModule {}
