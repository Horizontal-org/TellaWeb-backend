import { ReportEntity } from '../../domain';
import { CreateReportDto } from '../../dto';

export interface ICreateReportService {
  execute(createReportDto: CreateReportDto): Promise<ReportEntity>;
}
