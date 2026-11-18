import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteByIdProjectService } from '../../services/delete-by-id.project.service';
import { ProjectEntity } from '../../domain';
import { ReportEntity } from 'modules/report/domain';
import { TYPES as TYPES_REPORT } from 'modules/report/interfaces';

describe('DeleteByIdProjectService', () => {
  let service: DeleteByIdProjectService;
  let projectRepository: Repository<ProjectEntity>;
  let reportRepository: Repository<ReportEntity>;
  const batchDelete = { execute: jest.fn().mockResolvedValue(true) };

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteByIdProjectService,
        { provide: getRepositoryToken(ProjectEntity), useClass: Repository },
        { provide: getRepositoryToken(ReportEntity), useClass: Repository },
        {
          provide: TYPES_REPORT.services.IBatchDeleteReportService,
          useValue: batchDelete,
        },
      ],
    }).compile();

    service = app.get(DeleteByIdProjectService);
    projectRepository = app.get(getRepositoryToken(ProjectEntity));
    reportRepository = app.get(getRepositoryToken(ReportEntity));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    batchDelete.execute.mockClear();
  });

  it("deletes the project's reports before the project", async () => {
    jest
      .spyOn(reportRepository, 'find')
      .mockResolvedValue([{ id: 'r1' }, { id: 'r2' }] as ReportEntity[]);
    const del = jest
      .spyOn(projectRepository, 'delete')
      .mockResolvedValue({ affected: 1, raw: {} });

    await expect(service.execute('p1')).resolves.toBe(true);
    expect(batchDelete.execute).toHaveBeenCalledWith(['r1', 'r2']);
    expect(batchDelete.execute.mock.invocationCallOrder[0]).toBeLessThan(
      del.mock.invocationCallOrder[0],
    );
  });

  it('returns false when the project does not exist', async () => {
    jest.spyOn(reportRepository, 'find').mockResolvedValue([]);
    jest
      .spyOn(projectRepository, 'delete')
      .mockResolvedValue({ affected: 0, raw: {} });

    await expect(service.execute('missing')).resolves.toBe(false);
    expect(batchDelete.execute).toHaveBeenCalledWith([]);
  });
});
