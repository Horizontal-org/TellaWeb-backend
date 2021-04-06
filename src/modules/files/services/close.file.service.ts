import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CloseFileDto } from '../dto';
import { FileEntity } from '../domain';
import { FileNotFound } from '../exceptions';
import { StorageFileHandler } from '../handlers';
import { TYPES, ICloseFileService } from '../interfaces';

@Injectable()
export class CloseFileService implements ICloseFileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @Inject(TYPES.handlers.IStorageFileHandler)
    private readonly fileHandler: StorageFileHandler,
  ) {}

  async execute(closeFileDto: CloseFileDto): Promise<void> {
    const file = await this.fileRepository.findOne({
      where: {
        bucket: closeFileDto.bucket,
        fileName: closeFileDto.fileName,
      },
    });

    if (!file) throw new FileNotFound(closeFileDto.fileName);

    await this.fileHandler.close(closeFileDto);
    await this.fileRepository.save(file);

    return;
  }
}
