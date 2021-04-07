import { ReadUserDto } from 'modules/user/dto';

import { CreateReportDto, ReadReportDto } from '../../dto';

export interface ICreateReportApplication {
  execute(
    createReportDto: CreateReportDto,
    authorDto: ReadUserDto,
  ): Promise<ReadReportDto>;
}
