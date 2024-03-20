import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IEnableOtpAuthService, IOtpAuthHandler, TYPES } from '../interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'modules/user/domain';
import { Repository } from 'typeorm';
import { EnableOtpResponseAuthDto } from '../dto/enable-otp-response.auth.dto';
import { IVerifyOtpAuthService } from '../interfaces/services/verify-otp.auth.service.interface';

@Injectable()
export class VerifyOtpAuthService implements IVerifyOtpAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(TYPES.handlers.IOtpAuthHandler)
    private readonly otpHandler: IOtpAuthHandler,
  ) {}

  async execute(code, userId): Promise<void> {
    const userEntity = await this.userRepository.findOne(userId)

    if (!userEntity.otp_secret){
      throw new UnauthorizedException();
    }

    const isValid = this.otpHandler.verify(code, userEntity.otp_secret)
    
    if (!isValid){
      throw new UnauthorizedException();
    }

    return 
  }
}
