import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../domain/file.entity';
import { FileInputDto } from '../dto/file-input.dto';
import { IGetOrCreateFileService } from '../interfaces/services/get-or-create.file.service.interface';

@Injectable()
export class GetOrCreateFileService implements IGetOrCreateFileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async execute({ fileName, bucket }: FileInputDto): Promise<File> {
    const savedFile = await this.fileRepository.findOne({
      where: { fileName, bucket },
    });
    if (savedFile) return savedFile;

    const newFile = await this.fileRepository.save({
      fileName,
    });

    return newFile;
  }
}
