import {
  Get,
  Headers,
  HttpCode,
  Inject,
  Param,
  Response,
  UseGuards,
} from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { TYPES, IGetAssetFileApplication } from '../interfaces';
import { RolesUser } from 'modules/user/domain';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { ReportAccessGuard } from 'modules/report/guard/access.report.guard';

@AuthController(
  'file',
  [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER],
  JwtTypes.ALL,
)
export class GetAssetFileController {
  constructor(
    @Inject(TYPES.applications.IGetAssetFileApplication)
    private readonly getAssetFileApplication: IGetAssetFileApplication,
  ) {}

  @UseGuards(ReportAccessGuard)
  @Get('asset/:reportId/:fileId')
  @HttpCode(206)
  async handler(
    @Param('fileId') fileId: string,
    @Param('reportId') reportId: string,
    @Headers() headers,
    @Response() res,
  ) {
    const applicationResponse = await this.getAssetFileApplication.execute(
      fileId,
      reportId,
      headers.range,
    );

    res.set(applicationResponse.response);
    applicationResponse.stream.pipe(res);
  }
}
