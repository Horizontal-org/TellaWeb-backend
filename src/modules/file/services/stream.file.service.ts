import { Inject, Injectable } from '@nestjs/common';
import { FileDto } from '../dto';
import { FileType } from '../domain';
import { IStorageFileHandler, TYPES } from '../interfaces';
import { IStreamFileService } from '../interfaces/services/stream.file.service.interface';
import { StreamFileDto } from '../dto/stream.file.dto';

@Injectable()
export class StreamFileService implements IStreamFileService {
  constructor(
    @Inject(TYPES.handlers.IStorageFileHandler)
    private readonly storageFileHandler: IStorageFileHandler,
  ) {}

  async execute(fileDto: FileDto, range?: string): Promise<StreamFileDto> {
    if (fileDto.type === FileType.IMAGE) {
      const file = await this.storageFileHandler.fetch(fileDto);
      return {
        stream: file,
        response: {},
      };
    }

    return await this.storageFileHandler.stream(fileDto, range);
  }
}
