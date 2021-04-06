import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileEntity } from './domain/file.entity';

import {
  applicationsFileProviders,
  closeFileApplicationProvider,
  createFileApplicationProvider,
  getByNameAndBucketFileApplicationProvider,
  handlersFileProviders,
  servicesFileProviders,
} from './files.providers';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [
    ...handlersFileProviders,
    ...applicationsFileProviders,
    ...servicesFileProviders,
  ],
  exports: [
    getByNameAndBucketFileApplicationProvider,
    createFileApplicationProvider,
    closeFileApplicationProvider,
  ],
})
export class FilesModule {}
