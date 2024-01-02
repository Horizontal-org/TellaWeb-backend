import { Inject, Injectable } from '@nestjs/common';
import { ReadStream } from 'node:fs';

import {
  TYPES,
  
} from '../interfaces';
import { ICompressionFileHandler, IStorageFileHandler } from 'modules/file/interfaces';
import { IDownloadResourceService } from '../interfaces/services/download.resource.service.interface';

@Injectable()
export class DownloadResourceService implements IDownloadResourceService {
  constructor(
    @Inject(TYPES.handlers.IStorageFileHandler)
    private storageFileHandler: IStorageFileHandler,
    @Inject(TYPES.handlers.ICompressionFileHandler)
    private compressionFileHandler: ICompressionFileHandler,
  ) {}
  async execute(fileNames: string[]): Promise<ReadStream> {
    const filesStream = await this.storageFileHandler.getResources(fileNames);
    return await this.compressionFileHandler.execute(filesStream);
  }  
}
