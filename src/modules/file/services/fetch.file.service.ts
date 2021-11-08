import { Inject, Injectable } from '@nestjs/common';
import { ReadStream } from 'fs';
import { FileDto } from '../dto';
import { IStorageFileHandler, TYPES } from '../interfaces';
import { IFetchFileService } from '../interfaces/services/fetch.file.service.interface';

@Injectable()
export class FetchFileService implements IFetchFileService {
  constructor(
    @Inject(TYPES.handlers.IStorageFileHandler)
    private readonly storageFileHandler: IStorageFileHandler,
  ) {}

  async execute(fileDto: FileDto): Promise<ReadStream> {
    return await this.storageFileHandler.fetch(fileDto);
  }
}
