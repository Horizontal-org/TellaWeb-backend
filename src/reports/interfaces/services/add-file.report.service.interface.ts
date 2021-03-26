import { ReportDomain } from 'src/reports/domain/report.domain';
import { AddFileReportDto } from 'src/reports/dto/add-file-reports.dto';

export interface IAddFileReportService {
  execute(createReportDto: AddFileReportDto): Promise<ReportDomain>;
}
