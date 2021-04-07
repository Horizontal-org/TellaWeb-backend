import { ReadUserDto } from 'modules/user/dto';
import { ReportEntity } from '../../domain';
import { CreateReportDto } from '../../dto';

export interface ICreateReportService {
  execute(
    createReportDto: CreateReportDto,
    authorDto: ReadUserDto,
  ): Promise<ReportEntity>;
}
