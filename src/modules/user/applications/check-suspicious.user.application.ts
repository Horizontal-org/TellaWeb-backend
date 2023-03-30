import { Inject, UnauthorizedException } from '@nestjs/common';
import {  
  IFlagUserAuthService,
  ICheckSuspiciousUserApplication,
  TYPES,
  IFindByUsernameUserService,
} from '../interfaces';
import { IHandleWhitelistUserService } from '../interfaces/services/handle-whitelist.user.service.interface';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import * as geoip from 'geoip-lite'
import * as os from 'os'

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
    
    // const location = geoip.lookup(ip)
    //TESTING
    const location = geoip.lookup('190.210.141.21')    
    if (!location) {
      return false
    }

    const isSuspicious = await this.handleWhitelistUserService.execute(location.country, userId)
    console.log("🚀 ~ file: check-suspicious.user.application.ts:39 ~ execute ~ isSuspicious:", isSuspicious)

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
