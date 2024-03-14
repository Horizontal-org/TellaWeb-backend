import { Body, Inject, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';


import { CreateProjectDto, ReadProjectDto } from '../dto';
import { ICreateProjectApplication, TYPES } from '../interfaces';
import { ReadUserDto } from 'modules/user/dto';
import { LoggedUser } from 'modules/auth/decorators';

@AuthController('project', [RolesUser.ADMIN, RolesUser.EDITOR], JwtTypes.WEB)
export class CreateProjectController {
  constructor(
    @Inject(TYPES.applications.ICreateProjectApplication)
    private readonly createProjectApplication: ICreateProjectApplication,
  ) {}

  @ApiResponse({ type: ReadProjectDto })
  @Post()
  async handler(
    @Body() createProjectDto: CreateProjectDto,
    @LoggedUser() { id, username, role }: ReadUserDto,
  ): Promise<ReadProjectDto> {
    let projectDto = createProjectDto
    if (role !== 'admin') {
      projectDto.users = [id]
    }
    
    const project = await this.createProjectApplication.execute(createProjectDto);

    return project;
  }
}
