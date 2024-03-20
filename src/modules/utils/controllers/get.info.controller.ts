import { Get, Inject, Param } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthController } from 'common/decorators/auth-controller.decorator';

@AuthController('project')
export class GetInfoController {
  constructor() {}

  @ApiOkResponse()
  @Get('')
  async handler() {
    return {};
  }
}
