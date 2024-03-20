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
import { IGetRecoveryKeysService } from '../interfaces/services/get.recovery-keys.service.interface';

@Injectable()
export class GetRecoveryKeysService implements IGetRecoveryKeysService {
  constructor(
    @InjectRepository(RecoveryKeyEntity)
    private readonly recoveryRepository: Repository<RecoveryKeyEntity>
  ) {}

  async execute(userId): Promise<string[]> {
    const recoveryKeys = await this.recoveryRepository.find({ user: userId })
    
    return recoveryKeys.map(r => r.code)
  }
}