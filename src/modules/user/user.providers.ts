import { TYPES } from './interfaces';
import { CheckPasswordUserApplication } from './applications/check-password.user.application';
import { CreateUserApplication } from './applications/create.user.application';
import { FindByUsernameUserApplication } from './applications/find-by-username.user.application';
import { ListUserApplication } from './applications/list.user.application';
import { ToggleRoleByUsernameUserApplication } from './applications/toggle-role-by-username.user.application';
import { RolesUserGuard } from './guard/roles.user.guard';
import { CreateUserService } from './services/create.user.service';
import { FindByUsernameUserService } from './services/find-by-username.user.service';
import { ListUserService } from './services/list.user.service';
import { SetRoleUserService } from './services/set-role.user.service';
import { EditUserService } from './services/edit.user.service';
import { EditUserApplication } from './applications/edit.user.application';
import { GetByIdUserApplication } from './applications/get-by-id.user.application';
import { FindByidUserService } from './services/find-by-id.user.service';
import { MakePublicUserApplication } from './applications/make-public.user.application';
import { DeleteByIdUserApplication } from './applications/delete-by-id.user.application';
import { DeleteByIdUserService } from './services/delete-by-id.user.service';
import { BatchDeleteUsersApplication } from './applications/batch-delete.user.application';
import { BatchDeleteUsersService } from './services/batch-delete.user.service';
import { FlagUserAuthService } from './services/flag-user.auth.service';
import { CheckSuspiciousUserApplication } from './applications/check-suspicious.user.application';
import { UnblockUserService } from './services/unblock.user.service';
import { HandleWhitelistUserService } from './services/handle-whitelist.user.service';

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

export const checkPasswordUserApplicationProvider = {
  provide: TYPES.applications.ICheckPasswordUserApplication,
  useClass: CheckPasswordUserApplication,
};

export const editUserApplicationProvider = {
  provide: TYPES.applications.IEditUserApplication,
  useClass: EditUserApplication,
};

export const getByIdUserApplicationProvider = {
  provide: TYPES.applications.IGetUserByIdApplication,
  useClass: GetByIdUserApplication,
};

export const makePublicUserApplicationProvider = {
  provide: TYPES.applications.IMakePublicUserApplication,
  useClass: MakePublicUserApplication,
};

export const deleteByIdUserApplication = {
  provide: TYPES.applications.IDeleteByIdUserApplication,
  useClass: DeleteByIdUserApplication,
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

export const editUserServiceProvider = {
  provide: TYPES.services.IEditUserService,
  useClass: EditUserService,
};

export const findByIdUserServiceProvider = {
  provide: TYPES.services.IFindByIdUserService,
  useClass: FindByidUserService,
};

export const deleteByIdUserServiceProvider = {
  provide: TYPES.services.IDeleteByIdUserService,
  useClass: DeleteByIdUserService,
};

export const batchDeleteUsersApplicationProvider = {
  provide: TYPES.applications.IBatchDeleteUsersApplication,
  useClass: BatchDeleteUsersApplication,
};

export const batchDeleteUsersServiceProvider = {
  provide: TYPES.services.IBatchDeleteUsersService,
  useClass: BatchDeleteUsersService,
};

export const flagUserServiceProvider = {
  provide: TYPES.services.IFlagUserAuthService,
  useClass: FlagUserAuthService,
}

export const checkSuspiciousApplicationProvider = {
  provide: TYPES.applications.ICheckSuspiciousUserApplication,
  useClass: CheckSuspiciousUserApplication
}

export const unblockUserServiceProvider = {
  provide: TYPES.services.IUnblockUserService,
  useClass: UnblockUserService
}

export const handleWhitelistUserServiceProvider = {
  provide: TYPES.services.IHandleWhitelistUserService,
  useClass: HandleWhitelistUserService
}

export const applicationsUserProviders = [
  findByUsernameUserApplicationProvider,
  toggleRoleByUsernameUserApplicationProvider,
  listUserApplicationProvider,
  createUserApplicationProvider,
  checkPasswordUserApplicationProvider,
  editUserApplicationProvider,
  getByIdUserApplicationProvider,
  makePublicUserApplicationProvider,
  deleteByIdUserApplication,
  batchDeleteUsersApplicationProvider,
  checkSuspiciousApplicationProvider
];

export const servicesUserProviders = [
  findByUernameUserServiceProvider,
  listUserServiceProvider,
  setRoleUserServiceProvider,
  createUserServiceProvider,
  editUserServiceProvider,
  findByIdUserServiceProvider,
  deleteByIdUserServiceProvider,
  batchDeleteUsersServiceProvider,
  flagUserServiceProvider,
  unblockUserServiceProvider,
  handleWhitelistUserServiceProvider
];
