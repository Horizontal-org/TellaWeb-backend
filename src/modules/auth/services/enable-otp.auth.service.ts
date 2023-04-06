import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { authenticator } from 'otplib';
import {
  ICheckPasswordUserApplication,
  TYPES as TYPES_USER,
} from 'modules/user/interfaces';

import { LoginAuthDto } from '../domain';
import { IEnableOtpAuthService, IOtpAuthHandler, TYPES } from '../interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'modules/user/domain';
import { Repository } from 'typeorm';
import { EnableOtpResponseAuthDto } from '../dto/enable-otp-response.auth.dto';

@Injectable()
export class EnableOtpAuthService implements IEnableOtpAuthService {
  constructor(
    @Inject(TYPES_USER.applications.ICheckPasswordUserApplication)
    private checkPasswordUserApplication: ICheckPasswordUserApplication,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(TYPES.handlers.IOtpAuthHandler)
    private readonly otpHandler: IOtpAuthHandler,
  ) {}

  async execute({ username, password }: LoginAuthDto): Promise<EnableOtpResponseAuthDto> {
    
    let userDto = null 
    try {
      userDto = await this.checkPasswordUserApplication.execute({
        username,
        password,
      });
    } catch (_) {
      throw new UnauthorizedException();
    }

    const secret = authenticator.generateSecret()
    const userEntity = await this.userRepository.findOne(userDto.id)

    userEntity.refreshOtpSecret(secret);
    await this.userRepository.save(userEntity);

    const qr = await this.otpHandler.createQR(userEntity.username, 'Tellaweb', secret)
    return {
      otp_url: qr,
      otp_code: secret
    }
  }
}
