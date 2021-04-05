import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoles } from 'user/domain/user-roles.enum';
import { User } from 'user/domain/user.entity';

@Injectable()
export class RolesUserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRoles[]>(
      'roles',
      context.getHandler(),
    );
    console.log(roles);
    if (typeof roles === 'undefined') return true;

    const request = context.switchToHttp().getRequest();
    console.log(request.user);
    const user: User = request.user;
    if (!user) return false;

    return matchRoles(roles, user.role);
  }
}

export const matchRoles = (roles: UserRoles[], role: UserRoles): boolean => {
  console.log({ roles, role });
  return typeof roles.find((r) => r === role) !== 'undefined';
};
