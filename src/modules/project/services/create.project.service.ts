import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ICreateProjectService } from '../interfaces';
import { ProjectEntity } from '../domain';
import { CreateProjectDto } from '../dto';
import { UserEntity } from 'modules/user/domain';
import { ReportEntity } from 'modules/report/domain';

@Injectable()
export class CreateProjectService implements ICreateProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
  ) {}

  async execute(
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectEntity> {
    let reports = null
    let users = null

    if (createProjectDto.reports && createProjectDto.reports.length > 0) {
      reports = await this.reportRepository.findByIds(createProjectDto.reports)
    }

    if (createProjectDto.users && createProjectDto.users.length > 0) {
      users = await this.userRepository.findByIds(createProjectDto.users)
    }

    const project = new ProjectEntity();

    project.name = createProjectDto.name
    project.slug = (createProjectDto.name).toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\u0100-\uFFFF\w\-]/g,'-').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
    project.reports = reports
    project.users = users
    
    return this.projectRepository.save(project);
  }
}
