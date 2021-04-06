import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { ReadFileDto, FileDto } from '../dto';
import { FileEntity } from '../domain';
import { IGetOrCreateFileService } from '../interfaces';

@Injectable()
export class GetOrCreateFileService implements IGetOrCreateFileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async execute({ fileName, bucket }: ReadFileDto): Promise<FileDto> {
    const newFile = await this.fileRepository.save({
      fileName,
      bucket,
    });

    return plainToClass(FileDto, newFile);
  }
}
