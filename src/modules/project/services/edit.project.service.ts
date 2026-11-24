import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { EditProjectDto } from '../dto';
import { ProjectEntity } from '../domain';
import { UserEntity } from 'modules/user/domain';
import { ReportEntity } from 'modules/report/domain';
import { slugify } from 'common/utils/slug.utils';
import { IEditProjectService } from '../interfaces';
import {
  AlreadyExistProjectException,
  AlreadyExistSlugProjectException,
} from '../exceptions';
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
    let reports = null;
    let users = null;
    let resources = null;

    const project = await this.projectRepository.findOne({
      where: { id: editProjectDto.id },
      relations: { users: true, resources: true },
    });

    if (editProjectDto.reports && editProjectDto.reports.length > 0) {
      reports = await this.reportRepository.findBy({
        id: In(editProjectDto.reports),
      });
    }

    if (editProjectDto.users && editProjectDto.users.length > 0) {
      const currentUserIds = project.users.map((pu) => pu.id);
      const newIds = this.toggleEntityIds(editProjectDto.users, currentUserIds);
      users = await this.userRepository.findBy({ id: In(newIds) });
    }

    if (editProjectDto.resources && editProjectDto.resources.length > 0) {
      const currentResourceIds = project.resources.map((pu) => pu.id);
      const newIds = this.toggleEntityIds(
        editProjectDto.resources,
        currentResourceIds,
      );
      resources = await this.resourceRepository.findBy({ id: In(newIds) });
    }

    const slug = slugify(editProjectDto.slug || project.slug);
    const name = editProjectDto.name || project.name;

    const exist = await this.projectRepository.findOne({
      where: [
        { name, id: Not(project.id) },
        { slug, id: Not(project.id) },
      ],
    });
    // edit never regenerates the slug from the name, so a slug clash means the URL was edited
    if (exist?.slug === slug) throw new AlreadyExistSlugProjectException(slug);
    if (exist) throw new AlreadyExistProjectException(name);

    project.name = name;
    project.slug = slug;
    project.reports = reports || project.reports;
    project.users = users || project.users;
    project.resources = resources || project.resources;
    project.url = `${process.env.PUBLIC_DOMAIN}/p/${slug}`;

    await this.projectRepository.save(project);
    return project;
  }

  private toggleEntityIds = (dtoIds: string[], currentIds: string[]) => {
    const toDelete = [];
    const toAdd = [];

    dtoIds.forEach((id) => {
      if (currentIds.includes(id)) {
        toDelete.push(id);
      } else {
        toAdd.push(id);
      }
    });
    const remainingIds = currentIds.filter((uid) => !toDelete.includes(uid));
    return [...remainingIds, ...toAdd];
  };
}
