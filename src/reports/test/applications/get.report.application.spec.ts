import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GetByIdReportApplication } from '../../applications/get-by-id.report.application';
import { Report } from '../../domain/report.entity';
import { TYPES } from '../../interfaces/types';

const report: Report = {
  id: '111AAA',
  title: 'Test report',
  description: 'Test report for test cases',
  files: [],
};

class GetByIdReportService {
  getById() {
    return report;
  }
}

describe('GetByIdReportApplication', () => {
  let application: GetByIdReportApplication;
  let service: GetByIdReportService;
  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        GetByIdReportApplication,
        {
          provide: TYPES.services.IGetByIdReportService,
          useClass: GetByIdReportService,
        },
      ],
    }).compile();

    service = app.get<GetByIdReportService>(
      TYPES.services.IGetByIdReportService,
    );
    application = app.get<GetByIdReportApplication>(GetByIdReportApplication);
  });

  describe('create', () => {
    it('should create a report', async () => {
      expect(await application.execute(report.id)).toEqual(report);
    });

    it('should throw 404 error when report is not foud', async () => {
      jest.spyOn(service, 'getById').mockImplementation(() => null);
      try {
        await application.execute(report.id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(
          `Report with id ${report.id} was not found`,
        );
      }
    });
  });
});
