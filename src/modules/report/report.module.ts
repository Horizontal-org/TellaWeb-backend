import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportEntity } from './domain';
import { reportControllers } from './controllers';
import {
  applicationsReportProviders,
  getByIdReportApplicationProvider,
  servicesReportProviders,
} from './report.providers';
import { FileModule } from 'modules/file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReportEntity]), FileModule],
  controllers: [...reportControllers],
  providers: [...applicationsReportProviders, ...servicesReportProviders],
  exports: [getByIdReportApplicationProvider],
})
export class ReportModule {}
