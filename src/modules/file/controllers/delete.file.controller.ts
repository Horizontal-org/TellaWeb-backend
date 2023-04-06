import { Delete, Inject, Param } from '@nestjs/common';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';

import { TYPES, IDeleteFileApplication } from '../interfaces';

@AuthController('file', [RolesUser.ADMIN, RolesUser.EDITOR], JwtTypes.WEB)
export class DeleteFileController {
  constructor(
    @Inject(TYPES.applications.IDeleteFileApplication)
    private readonly deleteFileApplication: IDeleteFileApplication,
  ) {}

  @Delete(':reportId/:fileId')
  async handler(
    @Param('fileId')
    fileId: string,
  ) {
    const deleted = await this.deleteFileApplication.execute(fileId);
    return { deleted };
  }
}
