import { Inject, Injectable } from '@nestjs/common';

import {
  IDeleteBucketFileApplication,
  IDeleteBucketFileService,
  TYPES,
} from '../interfaces';

@Injectable()
export class DeleteBucketFileApplication
  implements IDeleteBucketFileApplication {
  constructor(
    @Inject(TYPES.services.IDeleteBucketFileService)
    private readonly deleteBucket: IDeleteBucketFileService,
  ) {}

  async execute(bucketId: string): Promise<boolean> {
    const deleted = await this.deleteBucket.execute(bucketId);

    return deleted;
  }
}
