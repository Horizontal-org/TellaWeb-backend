import { Body, Inject, Post, ParseUUIDPipe, Param } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { RolesUser } from 'modules/user/domain';

import { EditReportDto, ReadReportDto } from '../dto';
import { TYPES, IEditReportApplication } from '../interfaces';

@AuthController('report', [RolesUser.REPORTER, RolesUser.ADMIN])
export class EditReportController {
  constructor(
    @Inject(TYPES.applications.IEditReportApplication)
    private editReportApplication: IEditReportApplication,
  ) {}

  @ApiResponse({ type: ReadReportDto })
  @Post(':reportId')
  async handler(
    @Body() editReportDto: Partial<EditReportDto>,
    @Param('reportId', new ParseUUIDPipe()) reportId: string,
  ): Promise<ReadReportDto> {
    editReportDto.id = reportId;
    const report = await this.editReportApplication.execute(editReportDto);

    return report;
  }
}
