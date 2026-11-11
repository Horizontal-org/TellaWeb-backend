import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from 'modules/jwt/domain/jwt-payload.auth.ov';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { IVerifyMfaTokenAuthService } from '../interfaces/services/verify-mfa-token.auth.service.interface';

@Injectable()
export class VerifyMfaTokenAuthService implements IVerifyMfaTokenAuthService {
  constructor(private jwtService: JwtService) {}

  async execute(token: string): Promise<string> {
    let payload: JWTPayload;
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch (_) {
      throw new UnauthorizedException();
    }
    if (payload.type !== JwtTypes.MFA) throw new UnauthorizedException();
    return payload.userId;
  }
}
