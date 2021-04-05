import { Report } from 'reports/domain/report.entity';
import { Stream } from 'stream';

export type FileInputDto = {
  bucket: string;
  fileName: string;
  report: Report;
};

export type FileInputStreamDto = FileInputDto & {
  stream: Stream;
};
