import { Inject, Injectable } from '@nestjs/common';

import { InfoFileDto, ReadFileDto } from '../dto';
import { StorageFileHandler } from '../handlers';
import { TYPES, IGetInfoFileService } from '../interfaces';

@Injectable()
export class GetInfoFileService implements IGetInfoFileService {
  constructor(
    @Inject(TYPES.handlers.IStorageFileHandler)
    private readonly fileHandler: StorageFileHandler,
  ) {}

  async execute(input: ReadFileDto): Promise<InfoFileDto> {
    const fileDto = await this.fileHandler.get(input);
    return fileDto;
  }
}
