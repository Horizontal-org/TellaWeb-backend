import { Delete, Inject, Param } from '@nestjs/common';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { RolesUser } from 'modules/user/domain';

import { TYPES, IDeleteFileApplication } from '../interfaces';

@AuthController('file', [RolesUser.ADMIN])
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
