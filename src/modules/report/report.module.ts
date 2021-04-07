import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileModule } from 'modules/file/file.module';

import { ReportEntity } from './domain';
import { reportControllers } from './controller';
import {
  applicationsReportProviders,
  servicesReportProviders,
} from './report.providers';

@Module({
  imports: [TypeOrmModule.forFeature([ReportEntity]), FileModule],
  controllers: [...reportControllers],
  providers: [...applicationsReportProviders, ...servicesReportProviders],
})
export class ReportModule {}
