import { InjectQueue } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Queue } from 'bull';
import * as geoip from 'geoip-lite';
import * as os from 'os';
import {
  ICheckSuspiciousUserApplication, IFindByUsernameUserService, IFlagUserAuthService, TYPES
} from '../interfaces';
import { IHandleWhitelistUserService } from '../interfaces/services/handle-whitelist.user.service.interface';

export class CheckSuspiciousUserApplication
  implements ICheckSuspiciousUserApplication {
  constructor(
    @Inject(TYPES.services.IFlagUserAuthService)
    private readonly flagUserService: IFlagUserAuthService,
    @Inject(TYPES.services.IFindByIdUserService)
    private readonly findByIdUserService: IFindByUsernameUserService,
    @Inject(TYPES.services.IHandleWhitelistUserService)
    private readonly handleWhitelistUserService: IHandleWhitelistUserService,
    @InjectQueue('emails')
    private emailQueue: Queue
  ) {}

  async execute(ip, userId): Promise<boolean> {
    const user = await this.findByIdUserService.execute(userId)
    
    //TESTING
    const location = geoip.lookup(ip)
    if (!location) {
      return false
    }

    const isSuspicious = await this.handleWhitelistUserService.execute(location.country, userId)

    // if suspicious
    if (isSuspicious) {
      const verificationCode = await this.flagUserService.execute(user)
      
      this.emailQueue.add('send', {
        subject: 'blocked account',
        to: user.username,
        template: 'blocked-account',
        data: {
          username: user.username,
          location: location.country,
          ip: ip,
          device: os.hostname(),
          token: verificationCode
        }
      })
      
      return true
    }

    return false;
  }
}
