import { ReportDomain } from 'reports/domain/report.domain';
import { AddFileReportDto } from 'reports/dto/add-file-reports.dto';

export interface IAddFileReportService {
  execute(createReportDto: AddFileReportDto): Promise<ReportDomain>;
}
