import { Body, Inject, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

import { RolesUser } from '../domain';
import { CreateUserDto, ReadUserDto } from '../dto';
import { ICreateUserApplication, TYPES } from '../interfaces';

@AuthController('user', [RolesUser.ADMIN], JwtTypes.WEB)
export class CreateUserController {
  constructor(
    @Inject(TYPES.applications.ICreateUserApplication)
    private readonly createUserApplication: ICreateUserApplication,
  ) {}

  @ApiResponse({ type: ReadUserDto })
  @Post()
  async handler(@Body() createUserDto: CreateUserDto): Promise<ReadUserDto> {
    const user = await this.createUserApplication.execute(createUserDto);

    return user;
  }
}
