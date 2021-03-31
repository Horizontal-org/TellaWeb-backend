import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'user/domain/user-roles.enum';

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
