import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { ICreateProjectService } from '../interfaces';
import { ProjectEntity } from '../domain';
import { CreateProjectDto } from '../dto';
import { AlreadyExistProjectException } from '../exceptions';
import { UserEntity } from 'modules/user/domain';
import { ReportEntity } from 'modules/report/domain';
import { slugify } from 'common/utils/slug.utils';

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

  async execute(createProjectDto: CreateProjectDto): Promise<ProjectEntity> {
    let reports = null;
    let users = null;

    if (createProjectDto.reports && createProjectDto.reports.length > 0) {
      reports = await this.reportRepository.findBy({
        id: In(createProjectDto.reports),
      });
    }

    if (createProjectDto.users && createProjectDto.users.length > 0) {
      users = await this.userRepository.findBy({
        id: In(createProjectDto.users),
      });
    }

    const project = new ProjectEntity();

    const slug = slugify(createProjectDto.name);

    const exist = await this.projectRepository.findOne({
      where: [{ name: createProjectDto.name }, { slug }],
    });
    if (exist) throw new AlreadyExistProjectException(createProjectDto.name);

    project.name = createProjectDto.name;
    project.slug = slug;
    project.reports = reports;
    project.users = users;
    project.url = `${process.env.PUBLIC_DOMAIN}/p/${slug}`;

    return this.projectRepository.save(project);
  }
}
