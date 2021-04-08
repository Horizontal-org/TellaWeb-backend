import { CreateReportController } from './create.report.controller';
import { GetFileSizeReportController } from './get-file-size.report.controller';
import { GetByIdReportController } from './get-by-id.report.controller';
import { UploadFileReportController } from './upload-file.report.controller';
import { CloseFileReportController } from './close-file.report.controller';
import { ListReportController } from './list.report.controller';

export const reportControllers = [
  CreateReportController,
  GetByIdReportController,
  GetFileSizeReportController,
  UploadFileReportController,
  CloseFileReportController,
  ListReportController,
];
