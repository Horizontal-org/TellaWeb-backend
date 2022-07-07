import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportEntity } from './domain';
import { reportControllers } from './controllers';
import {
  applicationsReportProviders,
  getByIdReportApplicationProvider,
  servicesReportProviders,
} from './report.providers';
import { FileModule } from 'modules/file/file.module';
import { ProjectModule } from 'modules/project/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportEntity]), 
    FileModule, 
    forwardRef(() => ProjectModule),
  ],
  controllers: [...reportControllers],
  providers: [...applicationsReportProviders, ...servicesReportProviders],
  exports: [getByIdReportApplicationProvider],
})
export class ReportModule {}
