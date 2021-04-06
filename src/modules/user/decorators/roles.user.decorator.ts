import { SetMetadata } from '@nestjs/common';

import { RolesUser } from '../domain';

export const Roles = (...roles: RolesUser[]) => SetMetadata('roles', roles);
