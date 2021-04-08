import { applyDecorators, Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBasicAuth } from '@nestjs/swagger';

import { Roles } from 'modules/user/decorators/roles.user.decorator';
import { RolesUser } from 'modules/user/domain';
import { RolesUserGuard } from 'modules/user/guard/roles.user.guard';

export function AuthController(
  controllerName: string,
  roles: RolesUser[] = [],
) {
  return applyDecorators(
    ApiBasicAuth(),
    Controller(controllerName),
    UseGuards(AuthGuard('basic')),
    UseGuards(RolesUserGuard),
    Roles(...roles),
  );
}
