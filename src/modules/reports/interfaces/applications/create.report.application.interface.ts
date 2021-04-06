import { CreateReportDto, ReadReportDto } from '../../dto';

export interface ICreateReportApplication {
  execute(createReportDto: CreateReportDto): Promise<ReadReportDto>;
}
