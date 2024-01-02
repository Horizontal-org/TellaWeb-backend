import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CloseResourceDto } from '../dto';
import { ResourceEntity } from '../domain';
import { ICheckNameResourceService, ICloseResourceService, TYPES } from '../interfaces';
import { IStorageFileHandler } from 'modules/file/interfaces';
import { NotFoundFileException } from 'modules/file/exceptions';

@Injectable()
export class CheckNameResourceService implements ICheckNameResourceService {
  constructor(
    @InjectRepository(ResourceEntity)
    private readonly resourceRepository: Repository<ResourceEntity>,
    @Inject(TYPES.handlers.IStorageFileHandler)
    private readonly fileHandler: IStorageFileHandler,
  ) {}

  async execute(name: string): Promise<boolean> {
    const file = await this.resourceRepository.findOne({
      where: {
        fileName: name,
      },
    });

    return !!(file)
  }
}
