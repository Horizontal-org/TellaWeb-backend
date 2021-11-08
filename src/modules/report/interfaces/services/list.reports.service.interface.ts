import { PartialResult } from 'common/dto/partial-result.common.dto';

import { ReportEntity } from '../../domain';

export interface IListReportService {
  execute(take: number, limit: number): Promise<PartialResult<ReportEntity>>;
}
