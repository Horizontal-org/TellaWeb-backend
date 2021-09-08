import { Inject, Injectable } from '@nestjs/common';

import { ReadFileDto } from '../dto';
import {
  IDeleteFullFileService,
  IStorageFileHandler,
  TYPES,
} from '../interfaces';

@Injectable()
export class DeleteFullFileService implements IDeleteFullFileService {
  constructor(
    @Inject(TYPES.handlers.IStorageFileHandler)
    private readonly storageFileHandler: IStorageFileHandler,
  ) {}

  async execute({ bucket, fileName }: ReadFileDto): Promise<boolean> {
    const deleted = this.storageFileHandler.delete({ bucket, fileName });
    return deleted;
  }
}
