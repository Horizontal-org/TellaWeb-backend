import { Test } from '@nestjs/testing';
import { CreateReportApplication } from '../../applications/create.report.application';
import { ReadReportDto } from '../../dto/read.report.dto';
import { ReportEntity } from '../../domain/report.entity';
import { TYPES } from '../../interfaces/types';

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
      const report: ReportEntity = {
        id: '111AAA',
        title: 'Test report',
        description: 'Test report for test cases',
        files: [],
      };

      expect(await application.execute(report)).toEqual(report);
    });
  });
});
