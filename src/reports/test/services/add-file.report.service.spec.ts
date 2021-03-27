import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Report } from '../../domain/report.entity';
import { IAddFileReportService } from '../../interfaces/services/add-file.report.service.interface';
import { TYPES } from '../../interfaces/types';
import { TYPES as TYPES_FILES } from '../../../files/interfaces/types';
import { AddFileReportService } from '../../services/add-file.report.service';
import { IGetByIdFileApplication } from '../../../files/interfaces/applications/get-by-id.file.application.inteface';
import { FileDto } from '../../../files/dto/file.dto';
import { ReportFile } from '../../domain/report-files.entity';

const report: Report = {
  id: '111reportid',
  title: 'Report title',
  description: 'Report description',
  files: [],
};

const file: FileDto = {
  id: '111fileid',
  fileName: 'somepicture.jpg',
  bucket: report.id,
};

const reportFile = new ReportFile();
reportFile.file = file;
reportFile.report = report;

class mockGetByIdApplication implements IGetByIdFileApplication {
  async execute() {
    return file;
  }
}

describe('AddFileReportService', () => {
  let addFileReportService: IAddFileReportService;
  let mockReportRepository: Repository<Report>;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.services.IAddFileReportService,
          useClass: AddFileReportService,
        },
        {
          provide: getRepositoryToken(Report),
          useClass: Repository,
        },
        {
          provide: TYPES_FILES.applications.IGetByIdFileApplication,
          useClass: mockGetByIdApplication,
        },
      ],
    }).compile();

    addFileReportService = app.get<IAddFileReportService>(
      TYPES.services.IAddFileReportService,
    );

    mockReportRepository = app.get<Repository<Report>>(
      getRepositoryToken(Report),
    );

    return;
  });

  it('should add a file to the report', async () => {
    const reportSaved = {
      ...report,
      files: [reportFile],
    };

    jest.spyOn(mockReportRepository, 'findOne').mockResolvedValue(report);
    jest.spyOn(mockReportRepository, 'save').mockResolvedValue(reportSaved);

    const result = await addFileReportService.execute({
      fileId: file.id,
      reportId: report.id,
    });

    expect(result).toEqual(reportSaved);
    expect(mockReportRepository.save).toBeCalled();

    return;
  });
});
