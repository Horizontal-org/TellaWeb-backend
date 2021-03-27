import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateReportService } from '../../services/create.report.service';
import { Report } from '../../domain/report.entity';
import { TYPES } from '../../interfaces/types';
import { ICreateReportService } from '../../interfaces/services/create.report.service.interface';

describe('CreateReportService', () => {
  let service: ICreateReportService;
  let repositoryMock: Repository<Report>;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.services.ICreateReportService,
          useClass: CreateReportService,
        },
        {
          provide: getRepositoryToken(Report),
          useClass: Repository,
        },
      ],
    }).compile();

    service = app.get<ICreateReportService>(
      TYPES.services.ICreateReportService,
    );
    repositoryMock = app.get<Repository<Report>>(getRepositoryToken(Report));

    return;
  });

  describe('create', () => {
    it('should create a report', async () => {
      const report: Report = {
        id: '111AAA',
        title: 'Test report',
        description: 'Test report for test cases',
        files: [],
      };

      jest.spyOn(repositoryMock, 'save').mockResolvedValue(report);

      const result = await service.execute({
        title: report.title,
        description: report.description,
      });

      expect(result).toEqual(report);
      expect(repositoryMock.save).toBeCalled();
    });
  });
});
