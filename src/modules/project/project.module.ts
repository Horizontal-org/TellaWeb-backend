import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from 'modules/report/domain';
import { ReportModule } from 'modules/report/report.module';

import { UserEntity } from 'modules/user/domain';
import { projectControllers } from './controllers';
import { ProjectEntity } from './domain';
import { applicationsProjectProviders, guardsProjectProviders, servicesProjectProviders } from './project.providers';
import { ResourceEntity } from 'modules/resource/domain';
import { GlobalSettingModule } from 'modules/globalSettings/global-settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity]),  
    TypeOrmModule.forFeature([ReportEntity]),  
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([ResourceEntity]),
    forwardRef(() => ReportModule),
    forwardRef(() => GlobalSettingModule),
  ],
  controllers: [...projectControllers],
  providers: [...applicationsProjectProviders, ...servicesProjectProviders],
})
export class ProjectModule {}
