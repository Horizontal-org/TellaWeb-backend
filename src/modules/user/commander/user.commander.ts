import { Inject, Injectable } from '@nestjs/common';
import { ConsoleService } from 'nestjs-console';
import * as prompt from 'prompt';

import { ReadUserDto } from 'modules/user/dto';

import { RolesUser } from '../domain';
import {
  ICreateUserApplication,
  TYPES,
  IToggleRoleByUsernameUserApplication,
  IListUserApplication,
} from '../interfaces';

@Injectable()
export class UserCommander {
  constructor(
    @Inject(TYPES.applications.IListUserApplication)
    private readonly listUserApplication: IListUserApplication,
    @Inject(TYPES.applications.IToggleRoleByUsernameUserApplication)
    private readonly toggleRoleByUsernameUserApplication: IToggleRoleByUsernameUserApplication,
    @Inject(TYPES.applications.ICreateUserApplication)
    private readonly createUserApplication: ICreateUserApplication,
    private readonly consoleService: ConsoleService,
  ) {
    const cli = this.consoleService.getCli();
    const groupCommand = this.consoleService.createGroupCommand(
      {
        name: 'users',
        description: 'Create, Update, List and Delete users',
      },
      cli,
    );

    this.consoleService.createCommand(
      {
        command: 'list',
        description: 'List user and role',
      },
      () => this.listUsers(),
      groupCommand,
    );

    this.consoleService.createCommand(
      {
        command: 'toggle-role <username>',
        description: 'Toggle user role by username',
      },
      (username) => this.toggleUserRoleByUsername(username),
      groupCommand,
    );

    this.consoleService.createCommand(
      {
        command: 'create <username>',
        options: [
          {
            flags: '-a, --isAdmin',
            required: false,
          },
        ],
      },
      (username, options: { isAdmin: boolean }) =>
        this.createUser(username, options.isAdmin),
      groupCommand,
    );
  }

  async listUsers() {
    const users = await this.listUserApplication.execute();
    if (users.length === 0)
      return console.log('No users found in the application');

    const userToLog = users.map((user) => ({
      username: user.username,
      role: getUserRole(user),
    }));

    console.table(userToLog);
  }

  async toggleUserRoleByUsername(username: string) {
    const user = await this.toggleRoleByUsernameUserApplication.execute(
      username,
    );

    console.log(`${user.username} is now ${getUserRole(user)}`);
  }

  async createUser(username: string, isAdmin = false) {
    prompt.start();
    const { password } = await prompt.get(['password']);

    const user = await this.createUserApplication.execute({
      username,
      isAdmin,
      password: password.toString(),
    });

    console.log(`User ${username} was created with id ${user.id}`);
  }
}

const getUserRole = (user: ReadUserDto) =>
  user.role === RolesUser.ADMIN ? 'Admin' : 'User';
