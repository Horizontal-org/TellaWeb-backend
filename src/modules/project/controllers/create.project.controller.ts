import { Body, Inject, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';


import { CreateProjectDto, ReadProjectDto } from '../dto';
import { ICreateProjectApplication, TYPES } from '../interfaces';

@AuthController('project', [RolesUser.ADMIN, RolesUser.EDITOR], JwtTypes.WEB)
export class CreateProjectController {
  constructor(
    @Inject(TYPES.applications.ICreateProjectApplication)
    private readonly createProjectApplication: ICreateProjectApplication,
  ) {}

  @ApiResponse({ type: ReadProjectDto })
  @Post()
  async handler(@Body() createProjectDto: CreateProjectDto): Promise<ReadProjectDto> {
    const project = await this.createProjectApplication.execute(createProjectDto);

    return project;
  }
}
