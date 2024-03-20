import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RolesUser, UserEntity } from '../domain';

@Injectable()
export class RolesUserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const roles = this.reflector.get<RolesUser[]>('roles', context.getClass());
      const request = context.switchToHttp().getRequest();
      const user: UserEntity = request.user;
      if (typeof roles === 'undefined' || roles.length === 0) return true;
      
      if (!user) return false;
  
      return matchRoles(roles, user.role);
    } catch (e) {
      console.log("🚀 ~ file: roles.user.guard.ts:15 ~ RolesUserGuard ~ canActivate ~ e:", e)
      
    }
    
  }
}

export const matchRoles = (roles: RolesUser[], role: RolesUser): boolean => {
  return typeof roles.find((r) => r === role) !== 'undefined';
};
