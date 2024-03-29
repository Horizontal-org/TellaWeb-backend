import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from 'modules/report/domain';
import { ReportModule } from 'modules/report/report.module';

import { UserEntity } from 'modules/user/domain';
import { projectControllers } from './controllers';
import { ProjectEntity } from './domain';
import { applicationsProjectProviders, guardsProjectProviders, servicesProjectProviders } from './project.providers';
import { ResourceEntity } from 'modules/resource/domain';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity]),  
    TypeOrmModule.forFeature([ReportEntity]),  
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([ResourceEntity]),
    forwardRef(() => ReportModule),
  ],
  controllers: [...projectControllers],
  providers: [...applicationsProjectProviders, ...servicesProjectProviders],
})
export class ProjectModule {}
