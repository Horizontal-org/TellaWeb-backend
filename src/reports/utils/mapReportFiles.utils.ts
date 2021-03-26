import { TransformFnParams } from 'class-transformer';
import { ReportFile } from '../domain/report-files.entity';

export const mapReportFiles = ({ value: reportFiles }: TransformFnParams) => {
  console.log(reportFiles);
  return reportFiles.map((item: ReportFile) => ({
    name: item.file.fileName,
  }));
};
