import { CreateReportController } from './create.report.controller';
import { DeleteByIdReportController } from './delete-by-id.report.controller';
import { GetByIdReportController } from './get-by-id.report.controller';
import { ListReportController } from './list.report.controller';

export const reportControllers = [
  CreateReportController,
  GetByIdReportController,
  ListReportController,
  DeleteByIdReportController,
];
