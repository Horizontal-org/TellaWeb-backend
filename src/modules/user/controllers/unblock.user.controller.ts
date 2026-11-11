import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { TYPES, IUnblockUserService } from '../interfaces';

@Controller('user')
export class UnblockUserController {
  constructor(
    @Inject(TYPES.services.IUnblockUserService)
    private readonly unblockUser: IUnblockUserService,
  ) {}

  @ApiResponse({ type: Boolean })
  @Get('unblock')
  async handler(@Query('code') code = '', @Req() req): Promise<boolean> {
    await this.unblockUser.execute(code, req.ip);

    return true;
  }
}
