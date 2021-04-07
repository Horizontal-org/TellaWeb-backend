import { Inject, Injectable } from '@nestjs/common';

import { WriteStreamFileDto, FileDto } from '../dto';
import { StorageFileHandler } from '../handlers';
import {
  TYPES,
  IGetOrCreateFileService,
  IStoreFileService,
} from '../interfaces';

@Injectable()
export class StoreFileService implements IStoreFileService {
  constructor(
    @Inject(TYPES.handlers.IStorageFileHandler)
    private readonly fileHandler: StorageFileHandler,
    @Inject(TYPES.services.IGetOrCreateFileService)
    private readonly getOrCreateFileService: IGetOrCreateFileService,
  ) {}

  async execute(input: WriteStreamFileDto): Promise<FileDto> {
    await this.fileHandler.append(input);

    const file = await this.getOrCreateFileService.execute(input);

    return {
      id: file.id,
      bucket: file.bucket,
      fileName: file.fileName,
    };
  }
}
