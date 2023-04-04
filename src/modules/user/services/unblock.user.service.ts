import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';

import * as geoip from 'geoip-lite';
import { UserEntity } from '../domain';
import { UserVerificationCodeEntity } from '../domain/user-verification-code.entity';
import { UserWhitelistEntity } from '../domain/user-whitelist.entity';
import { NotFoundUserException } from '../exceptions';
import { IUnblockUserService } from '../interfaces';

export class UnblockUserService implements IUnblockUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserVerificationCodeEntity)
    private readonly userVerification: Repository<UserVerificationCodeEntity>,
    @InjectRepository(UserWhitelistEntity)
    private readonly userWhitelist: Repository<UserWhitelistEntity>,    
  ) {}

  async execute(code: string, ip: string): Promise<boolean> {
    const location = geoip.lookup(ip)
    if (!location) {
      throw new NotFoundUserException();
    }

    let verification = await this.userVerification.findOne({ 
      where: { code } ,
      relations: ['user'],
    });

    const now = new Date()
    if (verification && now < verification.expiresAt) {
      verification.user.blocked = false
      this.userRepository.save(verification.user)

      const whitelistItem = new UserWhitelistEntity();
      whitelistItem.location = location.country
      whitelistItem.user = verification.user
      await this.userWhitelist.save(whitelistItem)

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(UserVerificationCodeEntity)
        .where('code = :code', { code })
        .execute();
    } else {
      throw new NotFoundUserException();
    }

    return true;
  }
}
