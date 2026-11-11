import { Body, Inject, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';
import { TYPES } from '../interfaces';
import { ValidateRecoveryKeyAuthDto } from '../dto/validate-recovery-key.auth.dto';
import { IValidateRecoveryKeysService } from '../interfaces/services/validate.recovery-keys.service.interface';

@AuthController('auth', [RolesUser.ADMIN], JwtTypes.WEB)
export class ValidateRecoveryKeysController {
  constructor(
    @Inject(TYPES.services.IValidateRecoveryKeysService)
    private validateRecoveryKeys: IValidateRecoveryKeysService,
  ) {}

  // deprecated: no known client, to be removed
  @ApiOperation({ deprecated: true })
  @Post('/otp/validate/recovery-key')
  async handler(@Body() body: ValidateRecoveryKeyAuthDto): Promise<boolean> {
    await this.validateRecoveryKeys.execute(body.userId, body.code);

    return true;
  }
}
