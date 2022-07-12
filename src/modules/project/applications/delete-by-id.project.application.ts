import { Inject, Injectable } from '@nestjs/common';

import { NotFoundProjectException } from '../exceptions';
import {
  TYPES,
  IDeleteByIdProjectApplication,
  IDeleteByIdProjectService,
} from '../interfaces';

@Injectable()
export class DeleteByIdProjectApplication
  implements IDeleteByIdProjectApplication {
  constructor(
    @Inject(TYPES.services.IDeleteByIdProjectService)
    private deleteByIdProjectService: IDeleteByIdProjectService,
  ) {}

  async execute(projectId: string): Promise<boolean> {
    const deleted = await this.deleteByIdProjectService.execute(projectId);
    if (!deleted) throw new NotFoundProjectException(projectId);
    return deleted;
  }
}
