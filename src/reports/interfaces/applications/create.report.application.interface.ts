import { ReportDomain } from 'reports/domain/report.domain';
import { CreateReportDto } from 'reports/dto/create-report.dto';

export interface ICreateReportApplication {
  execute(createReportDto: CreateReportDto): Promise<ReportDomain>;
}
