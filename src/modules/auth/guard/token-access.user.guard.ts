import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, mixin } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

export const TokenAccessGuard = (accessType) => {
  
  @Injectable()
  class TokenAccessMixin implements CanActivate {
    
    constructor(
      public jwtService: JwtService,
      ) {}
      
    async canActivate(context: ExecutionContext) {      
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        throw new UnauthorizedException();
      }
      
      if (accessType === JwtTypes.ALL) {
        return true
      }

      if (!accessType) {
        return false
      }

      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: process.env.JWT_SECRET
          }
        );
        return accessType === payload.type
      } catch(e) {
        throw new UnauthorizedException();
      }      
    }

    public extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }

  const guard = mixin(TokenAccessMixin);
  return guard;
}