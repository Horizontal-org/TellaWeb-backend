import { ReportDomain } from 'src/reports/domain/report.domain';
import { CreateReportDto } from 'src/reports/dto/create-report.dto';

export interface ICreateReportApplication {
  execute(createReportDto: CreateReportDto): Promise<ReportDomain>;
}
