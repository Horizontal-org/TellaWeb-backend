import { Test } from '@nestjs/testing';
import { CreateReportApplication } from '../../applications/create.report.application';
import { ReportDomain } from '../../domain/report.domain';
import { Report } from '../../domain/report.entity';
import { TYPES } from '../../interfaces/types';

class CreateReportService {
  create(report: ReportDomain) {
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
          useClass: CreateReportService,
        },
      ],
    }).compile();

    application = app.get<CreateReportApplication>(CreateReportApplication);
  });

  describe('create', () => {
    it('should create a report', async () => {
      const report: Report = {
        id: '111AAA',
        title: 'Test report',
        description: 'Test report for test cases',
        files: [],
      };

      expect(await application.execute(report)).toEqual(report);
    });
  });
});
