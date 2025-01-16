import { Inject, Get } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';

import { TYPES, ILatestBackupService } from '../interfaces';
import { LatestBackupDto } from '../dto/latest.backup.dto';

@AuthController('backup', [RolesUser.ADMIN], JwtTypes.WEB)
export class LatestBackupController {
  constructor(
    @Inject(TYPES.services.ILatestBackupService)
    private latestBackupService: ILatestBackupService,
  ) {}

  @Get('latest')
  async handler(
  ): Promise<LatestBackupDto> {
    const latest = await this.latestBackupService.execute();
    
    return latest
  }
}
