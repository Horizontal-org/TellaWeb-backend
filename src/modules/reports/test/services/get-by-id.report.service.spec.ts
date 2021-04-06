import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportEntity } from '../../domain/report.entity';
import { GetByIdReportService } from '../../services/get-by-id.report.service';
import { Repository } from 'typeorm';
import { TYPES } from '../../../files/interfaces/types';
import { IGetByIdReportService } from '../../interfaces/services/get-by-id.report.service.interface';

describe('GetByIdReportService', () => {
  let service: IGetByIdReportService;
  let repositoryMock: Repository<ReportEntity>;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.services.IGetByIdFileService,
          useClass: GetByIdReportService,
        },
        {
          provide: getRepositoryToken(ReportEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = app.get<IGetByIdReportService>(
      TYPES.services.IGetByIdFileService,
    );

    repositoryMock = app.get<Repository<ReportEntity>>(
      getRepositoryToken(ReportEntity),
    );

    return;
  });

  describe('findById', () => {
    it('should find report by id', async () => {
      const report: ReportEntity = {
        id: '111AAA',
        title: 'Test report',
        description: 'Test report for test cases',
        files: [],
      };

      jest.spyOn(repositoryMock, 'findOne').mockResolvedValue(report);

      expect(await service.execute(report.id)).toEqual(report);
    });
  });
});
