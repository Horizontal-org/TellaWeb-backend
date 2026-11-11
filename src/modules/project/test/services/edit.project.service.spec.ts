import { Test, TestingModule } from '@nestjs/testing';
import { Not, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { EditProjectService } from '../../services/edit.project.service';
import { ProjectEntity } from '../../domain';
import { UserEntity } from 'modules/user/domain';
import { ReportEntity } from 'modules/report/domain';
import { ResourceEntity } from 'modules/resource/domain';

describe('EditProjectService', () => {
  let service: EditProjectService;
  let projectRepository: Repository<ProjectEntity>;

  const existing = () =>
    Object.assign(new ProjectEntity(), {
      id: 'p1',
      name: 'My Project',
      slug: 'my-project',
      users: [],
      resources: [],
      reports: [],
    });

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        EditProjectService,
        { provide: getRepositoryToken(ProjectEntity), useClass: Repository },
        { provide: getRepositoryToken(UserEntity), useClass: Repository },
        { provide: getRepositoryToken(ReportEntity), useClass: Repository },
        { provide: getRepositoryToken(ResourceEntity), useClass: Repository },
      ],
    }).compile();

    service = app.get(EditProjectService);
    projectRepository = app.get(getRepositoryToken(ProjectEntity));
  });

  afterEach(() => jest.restoreAllMocks());

  it('throws conflict when another project has the name or slug', async () => {
    jest
      .spyOn(projectRepository, 'findOne')
      .mockResolvedValueOnce(existing())
      .mockResolvedValueOnce(new ProjectEntity());
    const save = jest.spyOn(projectRepository, 'save');

    await expect(
      service.execute({ id: 'p1', name: 'Other' } as any),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(save).not.toHaveBeenCalled();
  });

  it('reports the URL when the edited slug is taken', async () => {
    jest
      .spyOn(projectRepository, 'findOne')
      .mockResolvedValueOnce(existing())
      .mockResolvedValueOnce(
        Object.assign(new ProjectEntity(), { name: 'Other', slug: 'taken' }),
      );

    await expect(
      service.execute({ id: 'p1', slug: 'taken' } as any),
    ).rejects.toThrow('URL taken is already in use');
  });

  it('allows saving with its own name, excluding itself from the lookup', async () => {
    const findOne = jest
      .spyOn(projectRepository, 'findOne')
      .mockResolvedValueOnce(existing())
      .mockResolvedValueOnce(null);
    const save = jest
      .spyOn(projectRepository, 'save')
      .mockImplementation(async (p) => p as ProjectEntity);

    const project = await service.execute({
      id: 'p1',
      name: 'My Project',
    } as any);

    expect(project.name).toBe('My Project');
    expect(save).toHaveBeenCalled();
    expect(findOne.mock.calls[1][0]).toEqual({
      where: [
        { name: 'My Project', id: Not('p1') },
        { slug: 'my-project', id: Not('p1') },
      ],
    });
  });
});
