import { Readable } from 'stream';

export interface IGetZippedBucketFileApplication {
  execute(bocketId: string): Promise<Readable>;
  getFilePathFromBucket(bucketId: string, fileName: string): Promise<string>;
}
