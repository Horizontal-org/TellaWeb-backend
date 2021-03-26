import { Injectable } from '@nestjs/common';
import { IGetByIdFileService } from '../interfaces/services/getById.file.service.interface';
import { File } from '../domain/file.entity';
import { FileDto } from '../dto/file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GetByIdFileService implements IGetByIdFileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
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
