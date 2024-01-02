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

@Module({
  imports: [
    TypeOrmModule.forFeature([ResourceEntity]), 
    TypeOrmModule.forFeature([ProjectEntity]),  
    FileModule, 
    // forwardRef(() => ProjectModule),
  ],
  controllers: [...resourceControllers],
  providers: [...applicationsResourceProviders, ...servicesResourceProviders],
})
export class ResourceModule {}
