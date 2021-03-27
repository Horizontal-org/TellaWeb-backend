import { TransformFnParams } from 'class-transformer';

export const mapReportFiles = ({ value: reportFiles }: TransformFnParams) => {
  return reportFiles.map((item: any) => ({
    name: item.file.fileName,
  }));
};
