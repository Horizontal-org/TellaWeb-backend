import { ReadReportDto } from 'modules/reports/dto';

import { CloseFileDto } from '../../dto';

export interface ICloseFileService {
  execute(input: CloseFileDto, readReportDto: ReadReportDto): Promise<void>;
}
