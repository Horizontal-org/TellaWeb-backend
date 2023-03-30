import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'modules/user/domain';
import { Repository } from 'typeorm';
import { IHandleWhitelistUserService } from '../interfaces/services/handle-whitelist.user.service.interface';
import { UserWhitelistEntity } from '../domain/user-whitelist.entity';

@Injectable()
export class HandleWhitelistUserService implements IHandleWhitelistUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserWhitelistEntity)
    private readonly userWhitelistRepo: Repository<UserWhitelistEntity>,
  ) {}

  async execute(location, userId): Promise<boolean> {
    
    const userWhitelist = await this.userWhitelistRepo.find({ where: { user: userId }})
    if (userWhitelist.length > 0) {
      const hasLocation = await this.userWhitelistRepo.find({ where: { 
        user: userId,
        location: location
      }})

      if (hasLocation.length === 0) {
        return true
      }
    } else {
      // first time you can pass
      const whitelistItem = new UserWhitelistEntity();
      whitelistItem.location = location
      whitelistItem.user = userId
      await this.userWhitelistRepo.save(whitelistItem)
    }


    return false
  }
}
