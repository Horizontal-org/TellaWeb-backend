import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../domain/file.entity';
import { FileInputDto } from '../dto/file-input.dto';
import { FileNotFound } from '../exceptions/file-not-found';
import { StorageFileHandler } from '../handlers/storage.file.handler';
import { ICloseFileService } from '../interfaces/services/close.file.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class CloseFileService implements ICloseFileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @Inject(TYPES.handlers.IStorageFileHandler)
    private readonly fileHandler: StorageFileHandler,
  ) {}

  async execute(fileInputDto: FileInputDto): Promise<void> {
    const file = await this.fileRepository.findOne({
      where: {
        bucket: fileInputDto.bucket,
        fileName: fileInputDto.fileName,
      },
    });

    if (!file) throw new FileNotFound(fileInputDto.fileName);

    await this.fileHandler.close(fileInputDto);
    await this.fileRepository.save(file);

    return;
  }
}
