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
  IBatchDeleteUsersApplication,
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
    @Inject(TYPES.applications.IBatchDeleteUsersApplication)
    private readonly batchDeleteUsersApplication: IBatchDeleteUsersApplication
  ) {
    const cli = this.consoleService.getCli();
    const groupCommand = this.consoleService.createGroupCommand(
      {
        command: 'users',
        description: 'Create, Update, List and Delete users',
      },
      cli,
    );

    this.consoleService.createCommand(
      {
        command: 'list',
        description: 'List user and role',
      },
      () => this.listUsers(0, 0, '', '', ''),
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

    this.consoleService.createCommand(
      {
        command: 'bulk-create',
        description: 'Create a bunch of random users',
      },
      () => this.createUsers(),
      groupCommand,
    );

    this.consoleService.createCommand(
      {
        command: 'bulk-delete',
        description: 'Delete users specified in commander script'
      },
      () =>
        this.deleteUsers(
          // Enter test id's to delete here
          ['', '']
          ),
      groupCommand,
    );
  }

  async listUsers(
    limit: number,
    offset: number,
    sort: string,
    order: string,
    search: string,
  ) {
    const users = await this.listUserApplication.execute(
      limit,
      offset,
      sort,
      order,
      search,
    );
    if (users.results.length === 0)
      return console.log('No users found in the application');

    const userToLog = users.results.map((user) => ({
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
      role: RolesUser.VIEWER,
      password: password.toString(),
    });

    console.log(`User ${username} was created with id ${user.id}`);
  }

  async createUsers() {
    prompt.start();

    for (let i = 0; i < 10; i++) {
      await this.createUserApplication.execute({
        username: Math.random().toString(36).substring(2, 7) + 'username',
        password: Math.random().toString(36).substring(2, 7) + 'password',
        role: RolesUser.VIEWER,
      });
    }

    console.log(`Users created`);
  }

  async deleteUsers(toDelete) {
    prompt.start();

    await this.batchDeleteUsersApplication.execute(toDelete)

    console.log(`Users deleted`);
  }

}

const getUserRole = (user: ReadUserDto) =>
  user.role === RolesUser.ADMIN ? 'Admin' : 'User';
