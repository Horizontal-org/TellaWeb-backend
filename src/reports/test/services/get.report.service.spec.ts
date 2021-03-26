import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Report } from '../../domain/report.entity';
import { GetByIdReportService } from '../../services/get-by-id.report.service';
import { Repository } from 'typeorm';

describe('GetByIdReportService', () => {
  let service: GetByIdReportService;
  let repositoryMock: Repository<Report>;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        GetByIdReportService,
        {
          provide: getRepositoryToken(Report),
          useClass: Repository,
        },
      ],
    }).compile();

    service = app.get<GetByIdReportService>(GetByIdReportService);
    repositoryMock = app.get<Repository<Report>>(getRepositoryToken(Report));
  });

  describe('findById', () => {
    it('should find report by id', async () => {
      const report: Report = {
        id: '111AAA',
        title: 'Test report',
        description: 'Test report for test cases',
        files: [],
      };

      jest.spyOn(repositoryMock, 'findOne').mockResolvedValue(report);

      expect(await service.execute(report.id)).toEqual(report);
      expect(repositoryMock.findOne).toBeCalled();
    });
  });
});
