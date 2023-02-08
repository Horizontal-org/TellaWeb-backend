import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IEnableOtpAuthService, IOtpAuthHandler, TYPES } from '../interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'modules/user/domain';
import { Repository } from 'typeorm';
import { IActivateOtpAuthService } from '../interfaces/services/activate-otp.auth.service.interface';

@Injectable()
export class ActivateOtpAuthService implements IActivateOtpAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,    
  ) {}

  async execute(userId): Promise<void> {
    const userEntity = await this.userRepository.findOne(userId)

    userEntity.otp_active = true;
    await this.userRepository.save(userEntity);

    return 
  }
}
