import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ProjectEntity } from '../domain';
import { IGetByIdProjectService } from '../interfaces/service/get-by-id.project.service.interface';
import { RolesUser, UserEntity } from 'modules/user/domain';
import { clone } from 'lodash'
@Injectable()
export class GetByIdProjectService implements IGetByIdProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async execute(projectId: string): Promise<ProjectEntity> {
    let project = await this.projectRepository.findOne(projectId, { relations: [
      'users', 
      'resources', 
      'resources.projects'
    ]});
    
    const adminUsers = await this.userRepository.find({ role: RolesUser.ADMIN })

    let newUsers = clone(project.users)
    adminUsers.forEach((u) => {
      const hasUser = !!(project.users.find(pu => pu.id == u.id))
      
      
      if (!hasUser) {
        newUsers.push(u) 
      }
    })
    
    project.users = newUsers
    console.log("🚀 ~ GetByIdProjectService ~ execute ~ newUsers:", project)
    return project
  }
}
