import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportModule } from 'modules/report/report.module';
import { fileControllers } from './controllers';

import { FileEntity } from './domain/file.entity';

import {
  applicationsFileProviders,
  compressionFileHandlerProvider,
  deleteBucketFileApplicationProvider,
  handlersFileProviders,
  servicesFileProviders,
  storageFileHandlerProvider,
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
  exports: [deleteBucketFileApplicationProvider, storageFileHandlerProvider, compressionFileHandlerProvider],
})
export class FileModule {}
