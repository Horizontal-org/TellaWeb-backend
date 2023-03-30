import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'modules/user/domain';
import { Repository } from 'typeorm';
import { UserVerificationCodeEntity } from 'modules/user/domain/user-verification-code.entity';
import { randomBytes } from 'crypto';
import { IFlagUserAuthService } from '../interfaces';

@Injectable()
export class FlagUserAuthService implements IFlagUserAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserVerificationCodeEntity)
    private readonly userVerificationRepo: Repository<UserVerificationCodeEntity>,    
  ) {}

  async execute(user): Promise<string> {
    user.blocked = true
    await this.userRepository.save(user)

    const verificationCode = randomBytes(20).toString('hex')
    const userVerification = new UserVerificationCodeEntity();
    userVerification.code = verificationCode
    userVerification.user = user

    const auxDate = new Date()
    userVerification.expiresAt = new Date(auxDate.getTime() + 30*60000)
    
    await this.userVerificationRepo.save(userVerification)

      
    return verificationCode
  }
}
