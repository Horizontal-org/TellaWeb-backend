import { Inject, Get } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';

import { TYPES, ICheckSpaceBackupService } from '../interfaces';
import { BackupSpace } from '../interfaces/services/check-space.backup.service.interface';

@AuthController('backup', [RolesUser.ADMIN], JwtTypes.WEB)
export class SpaceBackupController {
  constructor(
    @Inject(TYPES.services.ICheckSpaceBackupService)
    private checkSpaceService: ICheckSpaceBackupService,
  ) {}

  @Get('space')
  async handler(): Promise<BackupSpace> {
    return this.checkSpaceService.execute();
  }
}
