import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { IGetByIdReportApplication } from 'modules/report/interfaces/applications/get-by-id.report.application.interface';
import { IGetByIdReportService } from 'modules/report/interfaces/services/get-by-id.report.service.interface';
import { GetByIdReportApplication } from '../../applications/get-by-id.report.application';
import { ReportEntity } from '../../domain/report.entity';
import { TYPES } from '../../interfaces/types';

const report: ReportEntity = {
  id: '111AAA',
  title: 'Test report',
  description: 'Test report for test cases',
  files: [],
};

class GetByIdReportServiceMock implements IGetByIdReportService {
  async execute() {
    return report;
  }
}

describe('GetByIdReportApplication', () => {
  let application: IGetByIdReportApplication;
  let service: IGetByIdReportService;
  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.applications.IGetByIdReportApplication,
          useClass: GetByIdReportApplication,
        },
        {
          provide: TYPES.services.IGetByIdReportService,
          useClass: GetByIdReportServiceMock,
        },
      ],
    }).compile();

    service = app.get<IGetByIdReportService>(
      TYPES.services.IGetByIdReportService,
    );

    application = app.get<GetByIdReportApplication>(
      TYPES.applications.IGetByIdReportApplication,
    );
  });

  it('should create a report', async () => {
    expect(await application.execute(report.id)).toEqual(report);
  });

  it('should throw 404 error when report is not foud', async () => {
    jest.spyOn(service, 'execute').mockResolvedValue(null);
    try {
      await application.execute(report.id);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual(
        `Report with id ${report.id} was not found.`,
      );
    }
  });
});
