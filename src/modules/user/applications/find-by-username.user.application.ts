import { Inject } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { ReadUserDto } from '../dto';
import {
  TYPES,
  IFindByUsernameUserApplication,
  IFindByUsernameUserService,
} from '../interfaces';

export class FindByUsernameUserApplication
  implements IFindByUsernameUserApplication {
  constructor(
    @Inject(TYPES.services.IFindByUsernameUserService)
    private readonly findByUsernameApplicationService: IFindByUsernameUserService,
  ) {}

  async execute(username: string): Promise<ReadUserDto> {
    const user = this.findByUsernameApplicationService.execute(username);
    return plainToClass(ReadUserDto, user);
  }
}
