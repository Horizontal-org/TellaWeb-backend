import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CloseFileDto } from '../dto';
import { FileEntity } from '../domain';
import { NotFoundFileException } from '../exceptions';
import { TYPES, ICloseFileService, IStorageFileHandler } from '../interfaces';

@Injectable()
export class CloseFileService implements ICloseFileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @Inject(TYPES.handlers.IStorageFileHandler)
    private readonly fileHandler: IStorageFileHandler,
  ) {}

  async execute(closeFileDto: CloseFileDto, reportId: string): Promise<void> {
    const file = await this.fileRepository.findOne({
      where: {
        bucket: closeFileDto.bucket,
        fileName: closeFileDto.fileName,
      },
    });
    if (!file) throw new NotFoundFileException(closeFileDto.fileName);

    await this.fileHandler.close(closeFileDto);
    file.type = await this.fileHandler.getType(closeFileDto);
    file.attachToReport(reportId);
    await this.fileRepository.save(file);

    return;
  }
}
