import { Body, Inject, Post, ParseUUIDPipe, Param } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { RolesUser } from 'modules/user/domain';

import { EditProjectDto, ReadProjectDto } from '../dto';
import { TYPES, IEditProjectApplication } from '../interfaces';

@AuthController('project', [RolesUser.ADMIN, RolesUser.EDITOR])
export class EditProjectController {
  constructor(
    @Inject(TYPES.applications.IEditProjectApplication)
    private editProjectApplication: IEditProjectApplication,
  ) {}

  @ApiResponse({ type: ReadProjectDto })
  @Post(':projectId')
  async handler(
    @Body() editProjectDto: EditProjectDto,
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ): Promise<ReadProjectDto> {
    editProjectDto.id = projectId;
    const project = await this.editProjectApplication.execute(editProjectDto);

    return project;
  }
}
