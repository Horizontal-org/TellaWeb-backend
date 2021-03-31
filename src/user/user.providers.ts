import { TYPES } from 'user/interfaces/types';
import { CreateUserApplication } from './applications/create.user.application';
import { FindByUsernameUserApplication } from './applications/find-by-username.user.application';
import { ListUserApplication } from './applications/list.user.application';
import { ToggleRoleByUsernameUserApplication } from './applications/toggle-role-by-username.user.application';
import { RolesUserGuard } from './guard/roles.user.guard';
import { CreateUserService } from './services/create.user.service';
import { FindByUsernameUserService } from './services/find-by-username.user.service';
import { ListUserService } from './services/list.user.service';
import { SetRoleUserService } from './services/set-role.user.service';

export const rolesUserGuardProvider = {
  provide: TYPES.guards.IRolesUserGuard,
  useClass: RolesUserGuard,
};

export const findByUsernameUserApplicationProvider = {
  provide: TYPES.applications.IFindByUsernameUserApplication,
  useClass: FindByUsernameUserApplication,
};

export const toggleRoleByUsernameUserApplicationProvider = {
  provide: TYPES.applications.IToggleRoleByUsernameUserApplication,
  useClass: ToggleRoleByUsernameUserApplication,
};

export const listUserApplicationProvider = {
  provide: TYPES.applications.IListUserApplication,
  useClass: ListUserApplication,
};

export const createUserApplicationProvider = {
  provide: TYPES.applications.ICreateUserApplication,
  useClass: CreateUserApplication,
};

export const findByUernameUserServiceProvider = {
  provide: TYPES.services.IFindByUsernameUserService,
  useClass: FindByUsernameUserService,
};

export const listUserServiceProvider = {
  provide: TYPES.services.IListUserService,
  useClass: ListUserService,
};

export const setRoleUserServiceProvider = {
  provide: TYPES.services.ISetRoleService,
  useClass: SetRoleUserService,
};

export const createUserServiceProvider = {
  provide: TYPES.services.ICreateUserService,
  useClass: CreateUserService,
};
