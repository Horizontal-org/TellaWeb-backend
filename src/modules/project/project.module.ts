import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from 'modules/report/domain';

import { UserEntity } from 'modules/user/domain';
import { projectControllers } from './controllers';
import { ProjectEntity } from './domain';
import { applicationsProjectProviders, servicesProjectProviders } from './project.providers';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity]),  
    TypeOrmModule.forFeature([ReportEntity]),  
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [...projectControllers],
  providers: [...applicationsProjectProviders, ...servicesProjectProviders],
})
export class ProjectModule {}
