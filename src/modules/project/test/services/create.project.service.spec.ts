import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { CreateProjectService } from '../../services/create.project.service';
import { ProjectEntity } from '../../domain';
import { UserEntity } from 'modules/user/domain';
import { ReportEntity } from 'modules/report/domain';

describe('CreateProjectService', () => {
  let service: CreateProjectService;
  let projectRepository: Repository<ProjectEntity>;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProjectService,
        { provide: getRepositoryToken(ProjectEntity), useClass: Repository },
        { provide: getRepositoryToken(UserEntity), useClass: Repository },
        { provide: getRepositoryToken(ReportEntity), useClass: Repository },
      ],
    }).compile();

    service = app.get(CreateProjectService);
    projectRepository = app.get(getRepositoryToken(ProjectEntity));
  });

  afterEach(() => jest.restoreAllMocks());

  it('throws conflict when name or slug is taken', async () => {
    jest
      .spyOn(projectRepository, 'findOne')
      .mockResolvedValue(new ProjectEntity());
    const save = jest.spyOn(projectRepository, 'save');

    await expect(
      service.execute({ name: 'My Project' } as any),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(save).not.toHaveBeenCalled();
  });

  it('saves when name is free', async () => {
    jest.spyOn(projectRepository, 'findOne').mockResolvedValue(null);
    jest
      .spyOn(projectRepository, 'save')
      .mockImplementation(async (p) => p as ProjectEntity);

    const project = await service.execute({ name: 'My Project' } as any);
    expect(project.slug).toBe('my-project');
  });
});
