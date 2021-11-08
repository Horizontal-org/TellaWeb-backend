import { Inject, Injectable } from '@nestjs/common';
import { ReadStream } from 'node:fs';

import {
  TYPES,
  IZipBucketFileService,
  ICompressionFileHandler,
  IStorageFileHandler,
} from '../interfaces';

@Injectable()
export class ZipBucketFileService implements IZipBucketFileService {
  constructor(
    @Inject(TYPES.handlers.IStorageFileHandler)
    private storageFileHandlerl: IStorageFileHandler,
    @Inject(TYPES.handlers.ICompressionFileHandler)
    private compressionFileHandler: ICompressionFileHandler,
  ) {}
  async execute(bucketId: string): Promise<ReadStream> {
    const filesStream = await this.storageFileHandlerl.getBucket(bucketId);
    return await this.compressionFileHandler.execute(filesStream);
  }
}
