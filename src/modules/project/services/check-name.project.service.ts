import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { slugify } from 'common/utils/slug.utils';
import { ProjectEntity } from '../domain';
import { ICheckNameProjectService } from '../interfaces';

@Injectable()
export class CheckNameProjectService implements ICheckNameProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
  ) {}

  async execute(name: string, excludeId?: string): Promise<boolean> {
    const notSelf = excludeId ? { id: Not(excludeId) } : {};
    const exist = await this.projectRepository.findOne({
      where: [
        { name, ...notSelf },
        { slug: slugify(name), ...notSelf },
      ],
    });

    return !!exist;
  }
}
