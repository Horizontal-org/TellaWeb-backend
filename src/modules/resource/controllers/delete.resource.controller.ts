import { Delete, Inject, Param } from '@nestjs/common';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';

import { IDeleteResourceService, TYPES } from '../interfaces';

@AuthController('resource', [RolesUser.ADMIN, RolesUser.EDITOR], JwtTypes.WEB)
export class DeleteResourceController {
  constructor(
    @Inject(TYPES.services.IDeleteResourceService)
    private readonly deleteResourceService: IDeleteResourceService,
  ) {}

  @Delete(':fileId')
  async handler(
    @Param('fileId')
    fileId: string,
  ) {
    const deleted = await this.deleteResourceService.execute(fileId);
    return { deleted };
  }
}
