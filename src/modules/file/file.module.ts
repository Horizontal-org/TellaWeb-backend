import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportModule } from 'modules/report/report.module';
import { fileControllers } from './controllers';

import { FileEntity } from './domain/file.entity';

import {
  applicationsFileProviders,
  deleteBucketFileApplicationProvider,
  handlersFileProviders,
  servicesFileProviders,
} from './file.providers';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    forwardRef(() => ReportModule),
  ],
  controllers: [...fileControllers],
  providers: [
    ...handlersFileProviders,
    ...applicationsFileProviders,
    ...servicesFileProviders,
  ],
  exports: [deleteBucketFileApplicationProvider],
})
export class FileModule {}
