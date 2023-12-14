import { Body, Inject, Param, Post, UseGuards } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';

// import { OnlyAuthor } from 'modules/report/guard/only-author.report.guard';

import { ICloseResourceService, TYPES } from '../interfaces';
import { CloseResourceDto } from '../dto';
import { RolesUser } from 'modules/user/domain';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

@AuthController('resource', [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER, RolesUser.REPORTER], JwtTypes.WEB)

export class CloseResourceController {
  constructor(
    @Inject(TYPES.services.ICloseResourceService)
    private readonly closeResourceService: ICloseResourceService,
  ) {}

  @Post('upload/:fileName')
  async handler(
    @Param('fileName') fileName: string,
    @Body() closeResourceDto: CloseResourceDto
  ) {

    closeResourceDto.fileName = fileName

    try {
      await this.closeResourceService.execute(
        closeResourceDto,
      )
    } catch (err) {       
      console.log("🚀 ~ file: close.resource.controller.ts:33 ~ CloseResourceController ~ err:", err)
      return {
        success: false
      }
    }

    return {
      success: true
    }
  }
}
