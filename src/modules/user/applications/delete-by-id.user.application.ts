import { Inject, Injectable } from '@nestjs/common';

import { NotFoundUserException } from '../exceptions';
import {
  TYPES,
  IDeleteByIdUserService,
  IDeleteByIdUserApplication,
} from '../interfaces';

@Injectable()
export class DeleteByIdUserApplication implements IDeleteByIdUserApplication {
  constructor(
    @Inject(TYPES.services.IDeleteByIdUserService)
    private deleteByIdUserService: IDeleteByIdUserService,
  ) {}

  async execute(userId: string): Promise<boolean> {
    const deleted = await this.deleteByIdUserService.execute(userId);
    if (!deleted) throw new NotFoundUserException();
    return deleted;
  }
}
