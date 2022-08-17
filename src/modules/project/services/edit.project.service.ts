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

    if (editProjectDto.reports && editProjectDto.reports.length > 0) {
      reports = await this.reportRepository.findByIds(editProjectDto.reports)
    }

    if (editProjectDto.users && editProjectDto.users.length > 0) {
      users = await this.userRepository.findByIds(editProjectDto.users)
    }

    const project = await this.projectRepository.findOne(editProjectDto.id, { relations: ['users'] });
    project.name = editProjectDto.name || project.name
    project.slug = (editProjectDto.name || project.name).toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\u0100-\uFFFF\w\-]/g,'-').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
    project.reports = reports || project.reports
    project.users = users || project.users

    await this.projectRepository.save(project)
    return project;
  }
}
