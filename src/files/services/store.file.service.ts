import { Inject, Injectable } from '@nestjs/common';
import { FileInputStreamDto } from '../dto/file-input.dto';
import { FileDto } from '../dto/file.dto';
import { StorageFileHandler } from '../handlers/storage.file.handler';
import { IGetOrCreateFileService } from '../interfaces/services/get-or-create.file.service.interface';
import { IStoreFileService } from '../interfaces/services/store.file.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class StoreFileService implements IStoreFileService {
  constructor(
    @Inject(TYPES.handlers.IStorageFileHandler)
    private readonly fileHandler: StorageFileHandler,
    @Inject(TYPES.services.IGetOrCreateFileService)
    private readonly getOrCreateFileService: IGetOrCreateFileService,
  ) {}

  async execute(input: FileInputStreamDto): Promise<FileDto> {
    await this.fileHandler.append(input);

    const file = await this.getOrCreateFileService.execute(input);

    return {
      id: file.id,
      bucket: file.bucket,
      fileName: file.fileName,
    };
  }
}
