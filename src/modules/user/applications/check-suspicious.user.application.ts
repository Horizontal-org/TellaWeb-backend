import { InjectQueue } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Queue } from 'bull';
import * as os from 'os';
import {
  ICheckSuspiciousUserApplication, IFindByUsernameUserService, IFlagUserAuthService, TYPES
} from '../interfaces';
import { IHandleWhitelistUserService } from '../interfaces/services/handle-whitelist.user.service.interface';
import IPinfoWrapper from "node-ipinfo";

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

    const ipInfo = new IPinfoWrapper(process.env.IP_LOCATION_KEY)
    const location = await ipInfo.lookupIp(ip)

    if (!location || !location.country) {
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
          token: verificationCode,
          url: process.env.ADMIN_DOMAIN
        }
      })
      
      return true
    }

    return false;
  }
}
