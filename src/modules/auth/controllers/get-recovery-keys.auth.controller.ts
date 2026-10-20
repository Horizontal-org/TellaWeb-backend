import { Body, Inject, Post } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { LoggedUser } from 'modules/auth/decorators';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { ReadUserDto } from 'modules/user/dto';
import { IValidateAuthService, TYPES } from '../interfaces';
import { IGetRecoveryKeysService } from '../interfaces/services/get.recovery-keys.service.interface';
import { ConfirmPasswordUserDto } from 'modules/user/dto/confirm-password.user.dto';

@AuthController('auth', [], JwtTypes.WEB)
export class GetRecoveryKeysAuthController {
  constructor(
    @Inject(TYPES.services.IGetRecoveryKeysService)
    private getRecoveryKeysService: IGetRecoveryKeysService,
    @Inject(TYPES.services.IValidateAuthService)
    private validateAuthService: IValidateAuthService,
  ) {}

  @Post('/otp/retrieve-recovery-key')
  async handler(
    @LoggedUser() loggedUser: ReadUserDto,
    @Body() confirmPasswordDto: ConfirmPasswordUserDto,
  ): Promise<string[]> {
    const toValidate = {
      username: loggedUser.username,
      password: confirmPasswordDto.current,
    };

    await this.validateAuthService.execute(toValidate);

    const keys = await this.getRecoveryKeysService.execute(loggedUser.id);
    return keys;
  }
}
