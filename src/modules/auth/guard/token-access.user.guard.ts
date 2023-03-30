import { Injectable, CanActivate, ExecutionContext, mixin, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export const TokenAccessGuard = (accessType) => {
 
  @Injectable()
  class TokenAccessMixin implements CanActivate {
    
    constructor(
      public jwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext) {      
      // TODO REMOVE
      return true
      
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      console.log("🚀 ~ file: token-access.user.guard.ts:16 ~ TokenAccessMixin ~ canActivate ~ token:", token)
      console.log(process.env.JWT_SECRET)
      if (!token) {
        throw new UnauthorizedException();
      }
      
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: process.env.JWT_SECRET
          }
        );
        console.log("🚀 ~ file: token-access.user.guard.ts:31 ~ TokenAccessMixin ~ canActivate ~ payload:", payload)        
      } catch(e) {
        console.log("🚀 ~ file: token-access.user.guard.ts:33 ~ TokenAccessMixin ~ canActivate ~ e:", e)
        throw new UnauthorizedException();
      }
      console.log("🚀 ~ file: token-access.user.guard.ts:13 ~ TokenAccessMixin ~ canActivate ~ accessType:", accessType)
      if (!accessType) {
        return false
      }

    
      return true;
    }

    public extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }

  const guard = mixin(TokenAccessMixin);
  return guard;
}