import { Inject, Injectable } from '@nestjs/common';
import { ReadStream } from 'fs';

import {
  TYPES,
  IGetZippedBucketFileApplication,
  IZipBucketFileService,
} from '../interfaces';

@Injectable()
export class GetZippedBucketFileApplication
  implements IGetZippedBucketFileApplication
{
  constructor(
    @Inject(TYPES.services.IZipBucketFileService)
    private readonly zipBucketFileService: IZipBucketFileService,
  ) {}
  execute(bocketId: string): Promise<ReadStream> {
    return this.zipBucketFileService.execute(bocketId);
  }

  downloadFileFromBucket(
    bucketId: string,
    fileName: string,
  ): Promise<ReadStream> {
    return this.zipBucketFileService.downloadFileFromBucket(bucketId, fileName);
  }
}
