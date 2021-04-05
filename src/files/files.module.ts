import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './domain/file.entity';

import {
  closeFileApplicationProvider,
  closeFileServiceProvider,
  createFileApplicationProvider,
  getByIdFileApplicationProvider,
  getByIdFileServiceProvider,
  getByNameAndBucketFileApplicationProvider,
  getInfoFileServiceProvider,
  getOrCreateFileServiceProvider,
  storageFileHandlerProvider,
  storeFileSericeProvider,
} from './files.providers';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  providers: [
    storageFileHandlerProvider,
    getByNameAndBucketFileApplicationProvider,
    getByIdFileApplicationProvider,
    getInfoFileServiceProvider,
    createFileApplicationProvider,
    closeFileApplicationProvider,
    getByIdFileServiceProvider,
    getOrCreateFileServiceProvider,
    storeFileSericeProvider,
    closeFileServiceProvider,
  ],
  exports: [
    getByNameAndBucketFileApplicationProvider,
    createFileApplicationProvider,
    closeFileApplicationProvider,
  ],
})
export class FilesModule {}
