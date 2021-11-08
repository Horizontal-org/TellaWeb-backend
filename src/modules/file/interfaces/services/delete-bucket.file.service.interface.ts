export interface IDeleteBucketFileService {
  execute(bucketId: string): Promise<boolean>;
}
