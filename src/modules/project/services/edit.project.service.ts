import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EditProjectDto } from '../dto';
import { ProjectEntity } from '../domain';
import { UserEntity } from 'modules/user/domain';
import { ReportEntity } from 'modules/report/domain';
import { IEditProjectService } from '../interfaces';

@Injectable()
export class EditProjectService implements IEditProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
  ) {}

  async execute(editProjectDto: EditProjectDto): Promise<ProjectEntity> {
    let reports = null
    let users = null
    const project = await this.projectRepository.findOne(editProjectDto.id, { relations: ['users'] });

    if (editProjectDto.reports && editProjectDto.reports.length > 0) {
      reports = await this.reportRepository.findByIds(editProjectDto.reports)
    }

    if (editProjectDto.users && editProjectDto.users.length > 0) {
      
      let toDelete = []
      let toAdd = []
      let userIds = project.users.map(pu => pu.id)
      
      editProjectDto.users.forEach((id) => {
        if (userIds.includes(id)) {
          toDelete.push(id)
        } else {
          toAdd.push(id)
        }        
      })      
      // remove to delete
      userIds = userIds.filter(uid => !toDelete.includes(uid))      
      users = await this.userRepository.findByIds([...userIds, ...toAdd])
    }

    const slug = (editProjectDto.slug || project.slug).toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\u0100-\uFFFF\w\-]/g,'-').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
    project.name = editProjectDto.name || project.name
    project.slug = slug
    project.reports = reports || project.reports
    project.users = users || project.users
    project.url = `${process.env.PUBLIC_DOMAIN}/p/${slug}`

    await this.projectRepository.save(project)
    return project;
  }
}
