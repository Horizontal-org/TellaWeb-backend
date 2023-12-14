import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResourceEntity } from './domain';
import { resourceControllers } from './controllers';
import {
  applicationsResourceProviders,
  servicesResourceProviders
} from './resource.provider';
import { ProjectEntity } from 'modules/project/domain';
import { FileModule } from 'modules/file/file.module';

// import { FileModule } from 'modules/file/file.module';
// import { ProjectModule } from 'modules/project/project.module';
// import { ProjectEntity } from 'modules/project/domain';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResourceEntity]), 
    TypeOrmModule.forFeature([ProjectEntity]),  
    FileModule, 
    // forwardRef(() => ProjectModule),
  ],
  controllers: [...resourceControllers],
  providers: [...applicationsResourceProviders, ...servicesResourceProviders],
  // exports: [getByIdReportApplicationProvider, createReportApplicationProvider],
})
export class ResourceModule {}
