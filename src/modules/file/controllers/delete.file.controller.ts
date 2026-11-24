import { Delete, Inject, Param, UseGuards } from '@nestjs/common';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';

import { TYPES, IDeleteFileApplication } from '../interfaces';
import { ReportAccessGuard } from 'modules/report/guard/access.report.guard';

@AuthController('file', [RolesUser.ADMIN, RolesUser.EDITOR], JwtTypes.WEB)
export class DeleteFileController {
  constructor(
    @Inject(TYPES.applications.IDeleteFileApplication)
    private readonly deleteFileApplication: IDeleteFileApplication,
  ) {}

  @UseGuards(ReportAccessGuard)
  @Delete(':reportId/:fileId')
  async handler(
    @Param('fileId')
    fileId: string,
    @Param('reportId') reportId: string,
  ) {
    const deleted = await this.deleteFileApplication.execute(fileId, reportId);
    return { deleted };
  }
}
