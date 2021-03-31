import { Inject } from '@nestjs/common';
import { User } from 'user/domain/user.entity';
import { IListUserApplication } from 'user/interfaces/applications/list.user.application.interface';
import { IListUserService } from 'user/interfaces/services/list.user.service.interface';
import { TYPES } from 'user/interfaces/types';

export class ListUserApplication implements IListUserApplication {
  constructor(
    @Inject(TYPES.services.IListUserService)
    private readonly listUserService: IListUserService,
  ) {}

  async execute(): Promise<User[]> {
    return this.listUserService.execute();
  }
}
