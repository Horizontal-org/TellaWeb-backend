import { Test, TestingModule } from '@nestjs/testing';
import { Not, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CheckNameProjectService } from '../../services/check-name.project.service';
import { ProjectEntity } from '../../domain';

describe('CheckNameProjectService', () => {
  let service: CheckNameProjectService;
  let projectRepository: Repository<ProjectEntity>;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CheckNameProjectService,
        { provide: getRepositoryToken(ProjectEntity), useClass: Repository },
      ],
    }).compile();

    service = app.get(CheckNameProjectService);
    projectRepository = app.get(getRepositoryToken(ProjectEntity));
  });

  afterEach(() => jest.restoreAllMocks());

  it('returns true when a project matches the name or slug', async () => {
    const findOne = jest
      .spyOn(projectRepository, 'findOne')
      .mockResolvedValue(new ProjectEntity());

    expect(await service.execute('My Project')).toBe(true);
    expect(findOne).toHaveBeenCalledWith({
      where: [{ name: 'My Project' }, { slug: 'my-project' }],
    });
  });

  it('returns false when free and excludes the given id', async () => {
    const findOne = jest
      .spyOn(projectRepository, 'findOne')
      .mockResolvedValue(null);

    expect(await service.execute('My Project', 'p1')).toBe(false);
    expect(findOne).toHaveBeenCalledWith({
      where: [
        { name: 'My Project', id: Not('p1') },
        { slug: 'my-project', id: Not('p1') },
      ],
    });
  });
});
