import { Inject, Injectable } from '@nestjs/common';

import { ReadResourceDto, WriteStreamResourceDto } from '../dto';
import { StorageFileHandler } from '../../file/handlers';
import {
  IUploadResourceService,
  TYPES,
} from '../interfaces';
import { Repository } from 'typeorm';
import { ResourceEntity } from '../domain';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UploadResourceService implements IUploadResourceService {
  constructor(
    @Inject(TYPES.handlers.IStorageFileHandler)
    private readonly fileHandler: StorageFileHandler,    
    @InjectRepository(ResourceEntity)
    private readonly resourceRepository: Repository<ResourceEntity>,
  ) {}

  async execute(input: WriteStreamResourceDto): Promise<ReadResourceDto> {
    await this.fileHandler.append(input);

    const resource = new ResourceEntity();
    resource.fileName = input.fileName;
    resource.title = input.fileName.split('.pdf')[0]
    resource.type = 'pdf'
    const newResource = await this.resourceRepository.save(resource);
    
    return plainToClass(ReadResourceDto, newResource);
  }
}
