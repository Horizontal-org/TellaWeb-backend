import { ReadReportDto } from 'modules/report/dto';

import { ReadFileDto } from '../../dto';

export interface ICloseFileApplication {
  execute(input: ReadFileDto, readReportDto: ReadReportDto): Promise<void>;
}
