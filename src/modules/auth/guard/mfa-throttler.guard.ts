import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import {
  InjectThrottlerOptions,
  InjectThrottlerStorage,
  ThrottlerGuard,
  ThrottlerModuleOptions,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

// Counts 2FA attempts per user, so new IPs or fresh mfa tokens don't reset
// the limit. The token is verified, not decoded, so a forged one can't use
// up someone else's attempts.
@Injectable()
export class MfaThrottlerGuard extends ThrottlerGuard {
  constructor(
    @InjectThrottlerOptions() options: ThrottlerModuleOptions,
    @InjectThrottlerStorage() storage: ThrottlerStorage,
    reflector: Reflector,
    private jwtService: JwtService,
  ) {
    super(options, storage, reflector);
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    try {
      const payload = await this.jwtService.verifyAsync(req.body?.mfa_token);
      if (payload.type === JwtTypes.MFA) return `user:${payload.userId}`;
    } catch (_) {}
    return req.ip;
  }
}
