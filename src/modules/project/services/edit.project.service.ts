import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EditProjectDto } from '../dto';
import { ProjectEntity } from '../domain';
import { UserEntity } from 'modules/user/domain';
import { ReportEntity } from 'modules/report/domain';
import { IEditProjectService } from '../interfaces';
import { ResourceEntity } from 'modules/resource/domain';

@Injectable()
export class EditProjectService implements IEditProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ResourceEntity)
    private readonly resourceRepository: Repository<ResourceEntity>,
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
  ) {}

  async execute(editProjectDto: EditProjectDto): Promise<ProjectEntity> {
    console.log("🚀 ~ file: edit.project.service.ts:25 ~ EditProjectService ~ execute ~ editProjectDto:", editProjectDto)
    let reports = null
    let users = null
    let resources = null
    
    const project = await this.projectRepository.findOne(editProjectDto.id, { relations: ['users', 'resources'] });
    // console.log("🚀 ~ file: edit.project.service.ts:30 ~ EditProjectService ~ execute ~ project:", project)

    if (editProjectDto.reports && editProjectDto.reports.length > 0) {
      reports = await this.reportRepository.findByIds(editProjectDto.reports)
    }

    if (editProjectDto.users && editProjectDto.users.length > 0) {
      let currentUserIds = project.users.map(pu => pu.id)
      const newIds = this.toggleEntityIds(editProjectDto.users, currentUserIds)         
      users = await this.userRepository.findByIds(newIds)
    }

    if (editProjectDto.resources && editProjectDto.resources.length > 0) {
      let currentResourceIds = project.resources.map(pu => pu.id)
      const newIds = this.toggleEntityIds(editProjectDto.resources, currentResourceIds)         
      resources = await this.resourceRepository.findByIds(newIds)
    }
    
    console.log("🚀 ~ TOSAVERESOURCES", resources)
    const slug = (editProjectDto.slug || project.slug).toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\u0100-\uFFFF\w\-]/g,'-').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
    project.name = editProjectDto.name || project.name
    project.slug = slug
    project.reports = reports || project.reports
    project.users = users || project.users
    project.resources = resources || project.resources
    project.url = `${process.env.PUBLIC_DOMAIN}/p/${slug}`

    await this.projectRepository.save(project)
    return project;
  }

  private toggleEntityIds = (dtoIds: string[], currentIds: string[]) => {
    console.log("🚀 ~ file: edit.project.service.ts:61 ~ EditProjectService ~ currentIds:", currentIds)
    let toDelete = []
    let toAdd = []
    
    
    dtoIds.forEach((id) => {
      if (currentIds.includes(id)) {
        toDelete.push(id)
      } else {
        toAdd.push(id)
      }        
    })  
    
    console.log("🚀 ~ file: edit.project.service.ts:65 ~ EditProjectService ~ toAdd:", toAdd)
    console.log("🚀 ~ file: edit.project.service.ts:69 ~ EditProjectService ~ dtoIds.forEach ~ toDelete:", toDelete)
    // remove to delete
    let remainingIds = currentIds.filter(uid => !toDelete.includes(uid))      
    console.log("🚀 ~ file: edit.project.service.ts:77 ~ EditProjectService ~ remainingIds:", remainingIds)
    return [...remainingIds, ...toAdd]
  }
}
