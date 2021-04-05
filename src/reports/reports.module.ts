import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './domain/report.entity';
import { ReportsController } from './controller/reports.controller';
import { FilesModule } from 'files/files.module';

import {
  createReportApplicationProvider,
  getByIdReportApplicationProvider,
  createReportServiceProvider,
  getByIdServiceProvider,
} from './reports.providers';

@Module({
  imports: [TypeOrmModule.forFeature([Report]), FilesModule],
  controllers: [ReportsController],
  providers: [
    createReportApplicationProvider,
    getByIdReportApplicationProvider,
    createReportServiceProvider,
    getByIdServiceProvider,
  ],
})
export class ReportsModule {}
