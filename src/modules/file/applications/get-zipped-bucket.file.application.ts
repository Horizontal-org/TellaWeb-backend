import { Inject, Injectable } from '@nestjs/common';
import { Readable } from 'stream';

import {
  TYPES,
  IGetZippedBucketFileApplication,
  IZipBucketFileService,
} from '../interfaces';

@Injectable()
export class GetZippedBucketFileApplication implements IGetZippedBucketFileApplication {
  constructor(
    @Inject(TYPES.services.IZipBucketFileService)
    private readonly zipBucketFileService: IZipBucketFileService,
  ) {}
  execute(bocketId: string): Promise<Readable> {
    return this.zipBucketFileService.execute(bocketId);
  }

  getFilePathFromBucket(bucketId: string, fileName: string): Promise<string> {
    return this.zipBucketFileService.getFilePathFromBucket(bucketId, fileName);
  }
}
