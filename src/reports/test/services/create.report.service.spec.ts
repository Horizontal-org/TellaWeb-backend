import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateReportService } from '../../services/create.report.service';
import { Report } from '../../domain/report.entity';

describe('CreateReportService', () => {
  let service: CreateReportService;
  let repositoryMock: Repository<Report>;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CreateReportService,
        {
          provide: getRepositoryToken(Report),
          useClass: Repository,
        },
      ],
    }).compile();

    service = app.get<CreateReportService>(CreateReportService);
    repositoryMock = app.get<Repository<Report>>(getRepositoryToken(Report));
  });

  describe('create', () => {
    it('should create a report', async () => {
      const report: Report = {
        reportId: '111AAA',
        title: 'Test report',
        description: 'Test report for test cases',
      };

      jest.spyOn(repositoryMock, 'save').mockResolvedValue(report);

      expect(await service.execute(report)).toEqual(report);
      expect(repositoryMock.save).toBeCalled();
    });
  });
});
