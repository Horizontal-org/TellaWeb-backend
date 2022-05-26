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
    IDeleteByIdUserApplication: 'IDeleteByIdUserApplication',
    IBatchDeleteUsersApplication: 'IBatchDeleteUsersApplication',
  },
  services: {
    IFindByUsernameUserService: 'IFindByUsernameUserService',
    IListUserService: 'IListUserService',
    ISetRoleService: 'ISetRoleService',
    ICreateUserService: 'ICreateUserService',
    IEditUserService: 'IEditUserService',
    IFindByIdUserService: 'IFindByIdUserServcie',
    IDeleteByIdUserService: 'IDeleteByIdUserService',
    IBatchDeleteUsersService: 'IBatchDeleteUsersService',
  },
  guards: {
    IRolesUserGuard: 'IRolesUsersGuard',
  },
};
