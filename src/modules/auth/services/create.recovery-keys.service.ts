import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IEnableOtpAuthService, IOtpAuthHandler, TYPES } from '../interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'modules/user/domain';
import { getConnection, Repository } from 'typeorm';
import { IActivateOtpAuthService } from '../interfaces/services/activate-otp.auth.service.interface';
import { randomInt } from 'crypto';
import { RecoveryKeyEntity } from 'modules/user/domain/recovery-key.entity';
import { ICreateRecoveryKeysService } from '../interfaces/services/create.recovery-keys.service.interface';

@Injectable()
export class CreateRecoveryKeysService implements ICreateRecoveryKeysService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RecoveryKeyEntity)
    private readonly recoveryRepository: Repository<RecoveryKeyEntity>
  ) {}

  async execute(userId): Promise<string[]> {
    const userEntity = await this.userRepository.findOne(userId)
    
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(RecoveryKeyEntity)
      .where({ user: userEntity.id })
      .execute();

    let keys = []
    for (let i = 0; i < 15; i++) {
      const n = randomInt(10000000, 100000000)
      keys.push(n + '')

      const recoveryKey = new RecoveryKeyEntity();
      recoveryKey.code = n + ''
      recoveryKey.user = userEntity

      await this.recoveryRepository.save(recoveryKey)      
    }

    return keys
  }
}