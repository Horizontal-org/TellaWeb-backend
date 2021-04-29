import { CloseFileReportController } from './close.file.controller';
import { GetAssetFileController } from './get-asset.file.controller';
import { GetSizeFileController } from './get-size.file.controller';
import { UploadFileReportController } from './upload.file.controller';

export const fileControllers = [
  CloseFileReportController,
  GetSizeFileController,
  UploadFileReportController,
  GetAssetFileController,
];
