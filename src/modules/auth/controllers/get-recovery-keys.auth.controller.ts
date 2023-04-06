import { Get, Inject } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { LoggedUser } from 'modules/auth/decorators';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { ReadUserDto } from 'modules/user/dto';
import { TYPES } from '../interfaces';
import { IGetRecoveryKeysService } from '../interfaces/services/get.recovery-keys.service.interface';


@AuthController('auth', [], JwtTypes.WEB)
export class GetRecoveryKeysAuthController {
  constructor(
    @Inject(TYPES.services.IGetRecoveryKeysService)
    private getRecoveryKeysService: IGetRecoveryKeysService,
  ) {}

  @Get('/otp/recovery-key')
  async handler(@LoggedUser() loggedUser: ReadUserDto): Promise<string[]> {    
    const keys = await this.getRecoveryKeysService.execute(loggedUser.id)
    return keys
  }
}
