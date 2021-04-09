import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { IdReportDto } from '../dto/id.report.dto';

export const ParamReport = createParamDecorator(
  (field: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const reportId = request.param[field];

    const report = new IdReportDto(reportId);
    return report;
  },
);
