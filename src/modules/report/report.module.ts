import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from 'nestjs-console';

import { ReportEntity } from './domain';
import { reportControllers } from './controllers';
import {
  applicationsReportProviders,
  getByIdReportApplicationProvider,
  servicesReportProviders,
  createReportApplicationProvider,
  batchDeleteReportServiceProvider,
} from './report.providers';
import { ReportCommander } from './commander';
import { FileModule } from 'modules/file/file.module';
import { ProjectModule } from 'modules/project/project.module';
import { CreateReportApplication } from './applications/create.report.application';
import { ProjectEntity } from 'modules/project/domain';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportEntity]),
    TypeOrmModule.forFeature([ProjectEntity]),
    ConsoleModule,
    FileModule,
    forwardRef(() => ProjectModule),
  ],
  controllers: [...reportControllers],
  providers: [
    ...applicationsReportProviders,
    ...servicesReportProviders,
    ReportCommander,
  ],
  exports: [
    getByIdReportApplicationProvider,
    createReportApplicationProvider,
    batchDeleteReportServiceProvider,
  ],
})
export class ReportModule {}
