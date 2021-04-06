export const TYPES = {
  services: {
    IFindByUsernameUserService: 'IFindByUsernameUserService',
    IListUserService: 'IListUserService',
    ISetRoleService: 'ISetRoleService',
    ICreateUserService: 'ICreateUserService',
  },
  applications: {
    ICheckPasswordUserApplication: 'ICheckPasswordUserApplication',
    IFindByUsernameUserApplication: 'IFindByUsernameUserApplication',
    IToggleRoleByUsernameUserApplication:
      'IToggleRoleByUsernameUserApplication',
    IListUserApplication: 'IListUserApplication',
    ICreateUserApplication: 'ICreateUserApplication',
  },
  guards: {
    IRolesUserGuard: 'IRolesUsersGuard',
  },
};
