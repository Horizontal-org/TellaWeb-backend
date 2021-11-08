import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RolesUser, UserEntity } from '../domain';

@Injectable()
export class RolesUserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RolesUser[]>('roles', context.getClass());
    if (typeof roles === 'undefined' || roles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;
    if (!user) return false;

    return matchRoles(roles, user.role);
  }
}

export const matchRoles = (roles: RolesUser[], role: RolesUser): boolean => {
  return typeof roles.find((r) => r === role) !== 'undefined';
};
