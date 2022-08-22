import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportEntity } from './domain';
import { reportControllers } from './controllers';
import {
  applicationsReportProviders,
  getByIdReportApplicationProvider,
  servicesReportProviders,
  createReportApplicationProvider
} from './report.providers';
import { FileModule } from 'modules/file/file.module';
import { ProjectModule } from 'modules/project/project.module';
import { CreateReportApplication } from './applications/create.report.application';
import { ProjectEntity } from 'modules/project/domain';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportEntity]), 
    TypeOrmModule.forFeature([ProjectEntity]),  
    FileModule, 
    forwardRef(() => ProjectModule),
  ],
  controllers: [...reportControllers],
  providers: [...applicationsReportProviders, ...servicesReportProviders],
  exports: [getByIdReportApplicationProvider, createReportApplicationProvider],
})
export class ReportModule {}
