import { Inject } from '@nestjs/common';
import { IFindByUsernameUserApplication } from 'user/interfaces/applications/find-by-username.user.application.interface';
import { IFindByUsernameUserService } from 'user/interfaces/services/find-by-username.user.service.interface';
import { TYPES } from 'user/interfaces/types';

export class FindByUsernameUserApplication
  implements IFindByUsernameUserApplication {
  constructor(
    @Inject(TYPES.services.IFindByUsernameUserService)
    private readonly findByUsernameApplicationService: IFindByUsernameUserService,
  ) {}

  async execute(username: string) {
    return this.findByUsernameApplicationService.execute(username);
  }
}
