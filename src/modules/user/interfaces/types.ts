export const TYPES = {
  applications: {
    ICheckPasswordUserApplication: 'ICheckPasswordUserApplication',
    IFindByUsernameUserApplication: 'IFindByUsernameUserApplication',
    IToggleRoleByUsernameUserApplication:
      'IToggleRoleByUsernameUserApplication',
    IListUserApplication: 'IListUserApplication',
    ICreateUserApplication: 'ICreateUserApplication',
    IEditUserApplication: 'IEditUserApplication',
    IGetUserByIdApplication: 'IGetUserByIdApplication',
    IMakePublicUserApplication: 'IMakePublicUserApplication',
  },
  services: {
    IFindByUsernameUserService: 'IFindByUsernameUserService',
    IListUserService: 'IListUserService',
    ISetRoleService: 'ISetRoleService',
    ICreateUserService: 'ICreateUserService',
    IEditUserService: 'IEditUserService',
    IFindByIdUserService: 'IFindByIdUserServcie',
  },
  guards: {
    IRolesUserGuard: 'IRolesUsersGuard',
  },
};
