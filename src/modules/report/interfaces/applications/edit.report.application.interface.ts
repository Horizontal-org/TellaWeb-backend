import { EditReportDto, ReadReportDto } from '../../dto';

export interface IEditReportApplication {
  execute(editReportDto: EditReportDto): Promise<ReadReportDto>;
}
