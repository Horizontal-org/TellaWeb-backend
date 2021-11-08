import { ReadStream } from 'fs';

export interface IGetZippedBucketFileApplication {
  execute(bocketId: string): Promise<ReadStream>;
}
