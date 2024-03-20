import { Inject, Injectable } from '@nestjs/common';

import { IOtpAuthHandler } from '../interfaces/handlers/otp.auth.handler';
import { authenticator } from 'otplib';

@Injectable()
export class OtpAuthHandler implements IOtpAuthHandler {
  constructor(
  ) {}

  public async generate() {
    return 
  }

  public createQR(user, service, secret) {
    const otpUrl = authenticator.keyuri(user, service, secret);
    return otpUrl
  }

  public verify(token, secret) {
    return authenticator.verify({ token, secret })    
  }
}
