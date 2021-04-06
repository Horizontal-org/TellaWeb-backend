import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilesModule } from 'modules/files/files.module';

import { ReportEntity } from './domain';
import { ReportsController } from './controller';
import {
  applicationsReportProviders,
  servicesReportProviders,
} from './reports.providers';

@Module({
  imports: [TypeOrmModule.forFeature([ReportEntity]), FilesModule],
  controllers: [ReportsController],
  providers: [...applicationsReportProviders, ...servicesReportProviders],
})
export class ReportsModule {}
