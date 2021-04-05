import { Report } from 'reports/domain/report.entity';
import { CreateReportDto } from 'reports/dto/create-report.dto';

export interface ICreateReportService {
  execute(createReportDto: CreateReportDto): Promise<Report>;
}
