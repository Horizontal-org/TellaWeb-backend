import { ReadReportDto } from '../../dto';

export interface IGetByIdReportApplication {
  execute(id: string): Promise<ReadReportDto>;
}
