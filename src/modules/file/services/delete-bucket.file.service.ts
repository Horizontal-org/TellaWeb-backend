import { Inject, Injectable } from '@nestjs/common';

import {
  IDeleteBucketFileService,
  IStorageFileHandler,
  TYPES,
} from '../interfaces';

@Injectable()
export class DeleteBucketFileService implements IDeleteBucketFileService {
  constructor(
    @Inject(TYPES.handlers.IStorageFileHandler)
    private readonly storageFileHandler: IStorageFileHandler,
  ) {}

  async execute(bucketId: string): Promise<boolean> {
    const deleted = await this.storageFileHandler.deleteBucket(bucketId);
    return deleted;
  }
}
