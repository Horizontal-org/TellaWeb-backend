import { applyDecorators, Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'modules/auth/guard/jwt-auth.guard'
import { TokenAccessGuard } from 'modules/auth/guard/token-access.user.guard';
import { ProjectAccessGuard } from 'modules/project/guard/access.project.guard';

import { Roles } from 'modules/user/decorators/roles.user.decorator';
import { RolesUser } from 'modules/user/domain';
import { RolesUserGuard } from 'modules/user/guard/roles.user.guard';

export function AuthController(
  controllerName: string,
  roles: RolesUser[] = [],
  accessType: string = null,
  projectKeyType: string = null,
) {
  return applyDecorators(
    Controller(controllerName),
    ApiBearerAuth('jwt'),
    UseGuards(JwtAuthGuard),
    UseGuards(RolesUserGuard),
    Roles(...roles),
    UseGuards(TokenAccessGuard(accessType)),
    UseGuards(ProjectAccessGuard(projectKeyType)),
  );
}
