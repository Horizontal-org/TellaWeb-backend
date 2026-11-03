import { PartialResult } from 'common/dto/partial-result.common.dto';
import { ReadUserDto } from 'modules/user/dto';

import { ReportEntity } from '../../domain';

export interface IListReportService {
  execute(
    take: number,
    limit: number,
    sort: string,
    order: string,
    search: string,
    projectId: string,
    user: ReadUserDto,
  ): Promise<PartialResult<ReportEntity>>;
}
