import { CloseFileReportController } from './close.file.controller';
import { GetAssetFileController } from './get-asset.file.controller';
import { GetSizeFileController } from './get-size.file.controller';
import { GetThumbnailByIdFileController } from './get-thumbnail-by-id.file.controller';
import { UploadFileReportController } from './upload.file.controller';
import { DownloadBucketFileController } from './download-bucket.file.controller';
import { DeleteFileController } from './delete.file.controller';

export const fileControllers = [
  CloseFileReportController,
  GetSizeFileController,
  UploadFileReportController,
  GetAssetFileController,
  GetThumbnailByIdFileController,
  DownloadBucketFileController,
  DeleteFileController,
];
