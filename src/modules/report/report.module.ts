import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportEntity } from './domain';
import { reportControllers } from './controllers';
import {
  applicationsReportProviders,
  getByIdReportApplicationProvider,
  servicesReportProviders,
} from './report.providers';

@Module({
  imports: [TypeOrmModule.forFeature([ReportEntity])],
  controllers: [...reportControllers],
  providers: [...applicationsReportProviders, ...servicesReportProviders],
  exports: [getByIdReportApplicationProvider],
})
export class ReportModule {}
