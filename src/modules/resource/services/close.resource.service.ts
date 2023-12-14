import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CloseResourceDto } from '../dto';
import { ResourceEntity } from '../domain';
import { ICloseResourceService, TYPES } from '../interfaces';
import { IStorageFileHandler } from 'modules/file/interfaces';
import { NotFoundFileException } from 'modules/file/exceptions';

@Injectable()
export class CloseResourceService implements ICloseResourceService {
  constructor(
    @InjectRepository(ResourceEntity)
    private readonly resourceRepository: Repository<ResourceEntity>,
    @Inject(TYPES.handlers.IStorageFileHandler)
    private readonly fileHandler: IStorageFileHandler,
  ) {}

  async execute(closeResourceDto: CloseResourceDto): Promise<void> {
    const file = await this.resourceRepository.findOne({
      where: {
        fileName: closeResourceDto.fileName,
      },
    });
    if (!file) throw new NotFoundFileException(closeResourceDto.fileName);
    await this.fileHandler.close({
      bucket: 'resources',
      ...closeResourceDto
    });

    
    // sync with project
    
    await this.resourceRepository.save(file);

    return;
  }
}
