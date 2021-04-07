import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IGetByIdFileService } from '../interfaces';
import { FileEntity } from '../domain';
import { FileDto } from '../dto';

@Injectable()
export class GetByIdFileService implements IGetByIdFileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async execute(id: string): Promise<FileDto> {
    const file = await this.fileRepository.findOne(id);
    return {
      id,
      bucket: file.bucket,
      fileName: file.fileName,
    };
  }
}
