import { Readable } from 'stream';

export interface IZipBucketFileService {
  execute(bucketId: string): Promise<Readable>;
  getFilePathFromBucket(bucketId: string, fileName: string): Promise<string>;
}
