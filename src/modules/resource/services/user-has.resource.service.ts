import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CloseResourceDto } from '../dto';
import { ResourceEntity } from '../domain';
import { ICheckNameResourceService, ICloseResourceService, TYPES } from '../interfaces';
import { IStorageFileHandler } from 'modules/file/interfaces';
import { NotFoundFileException } from 'modules/file/exceptions';
import { IUserHasResourceService } from '../interfaces/services/user-has.resource.service.interface';
import { ProjectEntity } from 'modules/project/domain';

@Injectable()
export class UserHasResourceService implements IUserHasResourceService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,    
  ) {}

  async execute(userId: string, fileName: string): Promise<boolean> {
    const query = await this.projectRepository
      .createQueryBuilder('project')
      .innerJoin('project.resources', 'resources')
      .innerJoin('project.users', 'users')
      .where('users.id = :userId', { userId: userId })
      .where('resources.fileName = :fileName', { fileName: fileName })
      .getCount()

    return !!(query)
  }
}
