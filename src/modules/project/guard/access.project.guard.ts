import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  mixin,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'modules/user/domain';
import { Observable } from 'rxjs';
import { DataSource, Repository } from 'typeorm';
import { ProjectEntity } from '../domain';

export const ProjectAccessGuard = (projectKeyType) => {
  @Injectable()
  class ProjectAccessMixin implements CanActivate {
    // public: a mixin class with private members can't be declared (declaration: true)
    constructor(public readonly dataSource: DataSource) {}

    async canActivate(context: ExecutionContext) {
      if (!projectKeyType) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const user: UserEntity = request.user;

      if (user.role === 'admin') {
        return true;
      }

      const query = this.dataSource
        .createQueryBuilder()
        .from(ProjectEntity, 'project')
        .leftJoinAndSelect('project.users', 'users')
        .where('users.id = :userId', { userId: user.id });

      if (projectKeyType === 'slug') {
        query.andWhere('project.slug = :projectSlug', {
          projectSlug: request.params.projectSlug,
        });
      } else if (projectKeyType === 'id') {
        query.andWhere('project.id = :projectId', {
          projectId: request.params.projectId,
        });
      } else {
        return false;
      }

      const result = await query.getCount();

      return !!result;
    }
  }

  const guard = mixin(ProjectAccessMixin);
  return guard;
};
