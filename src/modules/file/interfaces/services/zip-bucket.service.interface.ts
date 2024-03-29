import { ReadStream } from 'fs';

export interface IZipBucketFileService {
  execute(bucketId: string): Promise<ReadStream>;
  downloadFileFromBucket(
    bucketId: string,
    fileName: string,
  ): Promise<ReadStream>;
}
