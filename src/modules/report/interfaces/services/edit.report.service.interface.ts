import { ReportEntity } from '../../domain';
import { EditReportDto } from '../../dto';

export interface IEditReportService {
  execute(editReportDto: EditReportDto): Promise<ReportEntity>;
}
