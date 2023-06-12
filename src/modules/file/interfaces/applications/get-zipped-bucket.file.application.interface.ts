import { ReadStream } from 'fs';

export interface IGetZippedBucketFileApplication {
  execute(bocketId: string): Promise<ReadStream>;
  downloadFileFromBucket(
    bucketId: string,
    fileName: string,
  ): Promise<ReadStream>;
}
