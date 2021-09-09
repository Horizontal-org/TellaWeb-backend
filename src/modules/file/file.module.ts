import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportModule } from 'modules/report/report.module';
import { fileControllers } from './controllers';

import { FileEntity } from './domain/file.entity';

import {
  applicationsFileProviders,
  closeFileApplicationProvider,
  createFileApplicationProvider,
  deleteFileApplicationProvider,
  getByNameAndBucketFileApplicationProvider,
  handlersFileProviders,
  servicesFileProviders,
} from './file.providers';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), ReportModule],
  controllers: [...fileControllers],
  providers: [
    ...handlersFileProviders,
    ...applicationsFileProviders,
    ...servicesFileProviders,
  ],
  exports: [
    getByNameAndBucketFileApplicationProvider,
    createFileApplicationProvider,
    closeFileApplicationProvider,
    deleteFileApplicationProvider,
  ],
})
export class FileModule {}
