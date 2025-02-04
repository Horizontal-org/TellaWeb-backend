import { Inject, Get, Delete, ParseUUIDPipe, Param } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';

import { TYPES, ILatestBackupService, IDeleteBackupService } from '../interfaces';

@AuthController('backup', [RolesUser.ADMIN], JwtTypes.WEB)
export class DeleteBackupController {
  constructor(
    @Inject(TYPES.services.IDeleteBackupService)
    private deleteBackupService: IDeleteBackupService,
  ) {}

  @Delete('delete/:backupId')
  async handler(
    @Param('backupId', new ParseUUIDPipe()) backupId: string
  ): Promise<void> {
    await this.deleteBackupService.execute(backupId);
  }
}
