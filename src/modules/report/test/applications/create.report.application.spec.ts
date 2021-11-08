import { Test } from '@nestjs/testing';
import { CreateReportApplication } from '../../applications/create.report.application';
import { ReadReportDto } from '../../dto/read.report.dto';
import { ReportEntity } from '../../domain/report.entity';
import { TYPES } from '../../interfaces/types';
import { UserEntity } from 'modules/user/domain';
import { ReadUserDto } from 'modules/user/dto';

class CreateReportServiceMock {
  execute(report: ReadReportDto) {
    return report;
  }
}

describe('CreateReportApplication', () => {
  let application: CreateReportApplication;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        CreateReportApplication,
        {
          provide: TYPES.services.ICreateReportService,
          useClass: CreateReportServiceMock,
        },
      ],
    }).compile();

    application = app.get<CreateReportApplication>(CreateReportApplication);
  });

  describe('create', () => {
    it('should create a report', async () => {
      const report = {
        id: '111AAA',
      } as ReadReportDto;

      const author = {
        toEntity: () => ({ id: 'AAA111' } as UserEntity),
      } as ReadUserDto;

      expect(await application.execute(report, author)).toEqual(report);
    });
  });
});
