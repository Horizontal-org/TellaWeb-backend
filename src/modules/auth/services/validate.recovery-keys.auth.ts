import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IEnableOtpAuthService, IOtpAuthHandler, TYPES } from '../interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'modules/user/domain';
import { getConnection, Repository } from 'typeorm';
import { IActivateOtpAuthService } from '../interfaces/services/activate-otp.auth.service.interface';
import { randomInt } from 'crypto';
import { RecoveryKeyEntity } from 'modules/user/domain/recovery-key.entity';
import { ICreateRecoveryKeysService } from '../interfaces/services/create.recovery-keys.service.interface';
import { IValidateRecoveryKeysService } from '../interfaces/services/validate.recovery-keys.service.interface';

@Injectable()
export class ValidateRecoveryKeysService implements IValidateRecoveryKeysService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RecoveryKeyEntity)
    private readonly recoveryRepository: Repository<RecoveryKeyEntity>
  ) {}

  async execute(userId, code): Promise<void> {
    const success = await this.recoveryRepository.findOne({ code: code ,user: userId })
    
    if (!success) {
      throw new UnauthorizedException()      
    }
  }
}