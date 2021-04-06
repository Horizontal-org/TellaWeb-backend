import { Inject } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { ReadUserDto } from '../dto';
import { TYPES, IListUserService, IListUserApplication } from '../interfaces';

export class ListUserApplication implements IListUserApplication {
  constructor(
    @Inject(TYPES.services.IListUserService)
    private readonly listUserService: IListUserService,
  ) {}

  async execute(): Promise<ReadUserDto[]> {
    const users = await this.listUserService.execute();
    return users.map((user) => plainToClass(ReadUserDto, user));
  }
}
