import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from '../domain';
import { IDeleteFileService } from '../interfaces';

@Injectable()
export class DeleteFileService implements IDeleteFileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async execute(fileId: string): Promise<boolean> {
    const deleted = await this.fileRepository.delete({ id: fileId });
    return deleted.affected === 1;
  }
}
