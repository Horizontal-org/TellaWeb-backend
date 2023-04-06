import { Body, Controller, Get, Inject, Post, Query, Req } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import * as requestIp from 'request-ip';

import {
  TYPES,
  IUnblockUserService,
} from '../interfaces';

@Controller('user')
export class UnblockUserController {
  constructor(
    @Inject(TYPES.services.IUnblockUserService)
    private readonly unblockUser: IUnblockUserService,
      ) {}

  @ApiResponse({ type: Boolean })
  @Get('unblock')
  async handler(
    @Query('code') code = '',  
    @Req() req
  ): Promise<boolean> {
    const ip = requestIp.getClientIp(req)
    await this.unblockUser.execute(code, ip);

    return true;
  }
}
