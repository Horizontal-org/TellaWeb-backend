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
    console.log(`[STORE] StoreFileService.execute() called for ${input.fileName}`);
    
    console.log(`[STORE] Calling fileHandler.append()...`);
    const bytesWritten = await this.fileHandler.append(input);
    console.log(`[STORE] fileHandler.append() completed, bytesWritten: ${bytesWritten}`);

    console.log(`[STORE] Calling getOrCreateFileService.execute()...`);
    const file = await this.getOrCreateFileService.execute(input);
    console.log(`[STORE] File record created/retrieved:`, file.id);

    return {
      id: file.id,
      bucket: file.bucket,
      fileName: file.fileName,
      type: file.type,
      bytesWritten,
    };
  }
}
