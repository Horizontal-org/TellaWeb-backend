import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { ReadUserDto } from '../dto';
import { RolesUser } from '../domain';
import {
  TYPES,
  ISetRoleUserService,
  IFindByUsernameUserService,
  IToggleRoleByUsernameUserApplication,
} from '../interfaces';

@Injectable()
export class ToggleRoleByUsernameUserApplication
  implements IToggleRoleByUsernameUserApplication {
  constructor(
    @Inject(TYPES.services.IFindByUsernameUserService)
    private readonly findByUsernameUserService: IFindByUsernameUserService,
    @Inject(TYPES.services.ISetRoleService)
    private readonly setRoleUserService: ISetRoleUserService,
  ) {}

  async execute(username: string): Promise<ReadUserDto> {
    const { role } = await this.findByUsernameUserService.execute(username);
    const user = await this.setRoleUserService.execute({
      username,
      isAdmin: !(role === RolesUser.ADMIN),
    });

    return plainToClass(ReadUserDto, user);
  }
}
