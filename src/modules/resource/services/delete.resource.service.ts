import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IDeleteResourceService, TYPES } from '../interfaces';
import { ResourceEntity } from '../domain';
import { IStorageFileHandler } from 'modules/file/interfaces';

@Injectable()
export class DeleteResourceService implements IDeleteResourceService {
  constructor(
    @InjectRepository(ResourceEntity)
    private readonly resourceRepository: Repository<ResourceEntity>,
    @Inject(TYPES.handlers.IStorageFileHandler)
    private readonly storageFileHandler: IStorageFileHandler,
  ) {}

  async execute(fileId: string): Promise<boolean> {
    const file = await this.resourceRepository.findOne({ id: fileId })   

    await this.storageFileHandler.delete({ bucket: 'resources', fileName: file.fileName });
    const deleted = await this.resourceRepository.delete({ id: fileId });

    return deleted.affected === 1;
  }
}
