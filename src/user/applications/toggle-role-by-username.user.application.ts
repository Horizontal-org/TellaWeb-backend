import { Inject, Injectable } from '@nestjs/common';
import { UserRoles } from 'user/domain/user-roles.enum';
import { User } from 'user/domain/user.entity';
import { IToggleRoleByUsernameUserApplication } from 'user/interfaces/applications/toggle-role-by-username.user.application.interface';
import { IFindByUsernameUserService } from 'user/interfaces/services/find-by-username.user.service.interface';
import { ISetRoleUserService } from 'user/interfaces/services/set-role.user.service.interface';
import { TYPES } from 'user/interfaces/types';

@Injectable()
export class ToggleRoleByUsernameUserApplication
  implements IToggleRoleByUsernameUserApplication {
  constructor(
    @Inject(TYPES.services.IFindByUsernameUserService)
    private readonly findByUsernameUserService: IFindByUsernameUserService,
    @Inject(TYPES.services.ISetRoleService)
    private readonly setRoleUserService: ISetRoleUserService,
  ) {}

  async execute(username: string): Promise<User> {
    const { role } = await this.findByUsernameUserService.execute(username);
    const userChanged = await this.setRoleUserService.execute({
      username,
      isAdmin: !(role === UserRoles.ADMIN),
    });

    return userChanged;
  }
}
