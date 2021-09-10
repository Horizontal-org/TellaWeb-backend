export interface IDeleteBucketFileApplication {
  execute(bucketId: string): Promise<boolean>;
}
