import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'modules/user/domain';
import { getConnection, Repository } from 'typeorm';
import { IDisableOtpAuthService } from '../interfaces/services/disable-otp.auth.service.interface';
import { RecoveryKeyEntity } from 'modules/user/domain/recovery-key.entity';

@Injectable()
export class DisableOtpAuthService implements IDisableOtpAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(userId): Promise<void> {
    
    const userEntity = await this.userRepository.findOne(userId)

    userEntity.refreshOtpSecret(null);
    userEntity.otp_active = false
    await this.userRepository.save(userEntity);
    
    // delete recovery keys 
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(RecoveryKeyEntity)
      .where({ user: userEntity.id })
      .execute();

  }
}
