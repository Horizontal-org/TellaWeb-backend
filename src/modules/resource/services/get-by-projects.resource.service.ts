import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';

import { ByProjectResourceDto, CloseResourceDto, ReadResourceDto } from '../dto';
import { ICheckNameResourceService, ICloseResourceService, IGetByProjectsResourceService, TYPES } from '../interfaces';
import { ProjectEntity } from 'modules/project/domain';
import { plainToClass } from 'class-transformer';
import { ReadUserDto } from 'modules/user/dto';

@Injectable()
export class GetByProjectsResourceService implements IGetByProjectsResourceService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
  ) {}

  async execute(ids: string[], userId: string, userRole: string): Promise<ByProjectResourceDto[]> {
  
    const query = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.resources', 'resources')
      .leftJoinAndSelect('project.users', 'users')
      .where('project.id IN (:...ids)', { ids: ids })

    if (userRole !== 'admin') {
      query.andWhere('users.id = :userId', { userId: userId })
    }

    const result = await query.getMany()

    return result.map((project) => plainToClass(ByProjectResourceDto, project))
  }
}
