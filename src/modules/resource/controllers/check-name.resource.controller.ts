import { Body, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';

// import { OnlyAuthor } from 'modules/report/guard/only-author.report.guard';

import { ICheckNameResourceService, ICloseResourceService, TYPES } from '../interfaces';
import { CloseResourceDto } from '../dto';
import { RolesUser } from 'modules/user/domain';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

@AuthController('resource', [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER, RolesUser.REPORTER], JwtTypes.WEB)

export class CheckNameResourceController {
  constructor(
    @Inject(TYPES.services.ICheckNameResourceService)
    private readonly checkNameService: ICheckNameResourceService,
  ) {}

  @Get('check/:fileName')
  async handler(
    @Param('fileName') fileName: string,
  ) {

    const res = await this.checkNameService.execute(
      fileName
    )

    return {
      taken: res
    }
  }
}
