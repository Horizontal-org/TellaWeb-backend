import { Inject, Injectable } from '@nestjs/common';
import { FileInfoDto } from '../dto/file-info.dto';
import { FileInputDto } from '../dto/file-input.dto';
import { StorageFileHandler } from '../handlers/storage.file.handler';
import { IGetInfoFileService } from '../interfaces/services/get-info.file.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class GetInfoFileService implements IGetInfoFileService {
  constructor(
    @Inject(TYPES.handlers.IStorageFileHandler)
    private readonly fileHandler: StorageFileHandler,
  ) {}

  async execute(input: FileInputDto): Promise<FileInfoDto> {
    const fileDto = await this.fileHandler.get(input);
    return fileDto;
  }
}
