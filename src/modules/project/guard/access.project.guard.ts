import { CanActivate, ExecutionContext, Inject, Injectable, mixin } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "modules/user/domain";
import { Observable } from "rxjs";
import { getConnection, Repository } from "typeorm";
import { ProjectEntity } from "../domain";


export const ProjectAccessGuard = (projectKeyType) => {

  @Injectable()
  class ProjectAccessMixin implements CanActivate {
    constructor(
    ) {}

    async canActivate(context: ExecutionContext) {      
      try {
        if (!projectKeyType) {
          return true
        }
        const request = context.switchToHttp().getRequest();
        const user: UserEntity = request.user;
        
        if (user.role === 'admin') {
          return true
        }
  
        const query = getConnection()
          .createQueryBuilder()
          .from(ProjectEntity, 'project')
          .leftJoinAndSelect('project.users', 'users')        
          .where('users.id = :userId', { userId: user.id })
          
        if (projectKeyType === 'slug') {
          query.andWhere('project.slug = :projectSlug', { projectSlug: request.params.projectSlug})
        } else if (projectKeyType === 'id') {
          query.andWhere('project.id = :projectId', { projectId: request.params.projectId})
        } else {
          return false 
        }
        
        const result = await query.getCount()
    
        return !!(result);  
      } catch (e) {
      console.log("🚀 ~ file: access.project.guard.ts:48 ~ ProjectAccessMixin ~ canActivate ~ e:", e)
      }
      
    }
  }

  const guard = mixin(ProjectAccessMixin);
  return guard;
};