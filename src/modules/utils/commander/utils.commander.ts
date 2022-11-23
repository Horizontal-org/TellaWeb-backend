import { Inject, Injectable } from '@nestjs/common';
import { ConsoleService } from 'nestjs-console';
import { createConnection, getConnectionManager } from 'typeorm';
import { OrmConfig } from '../../../ormconfig';
import * as prompt from 'prompt';


@Injectable()
export class UtilsCommander {
  constructor(
    private readonly consoleService: ConsoleService,
  ){
    const cli = this.consoleService.getCli();
    const groupCommand = this.consoleService.createGroupCommand(
      {
        command: 'utils',
        description: 'Utils',
      },
      cli,
    );

    this.consoleService.createCommand(
      {
        command: 'migrate',
        description: 'Run migration',
      },
      () => this.migrate(),
      groupCommand,
    );
  }

  async migrate(){
    const cm = getConnectionManager()
    const connection = cm.get()
    await connection.query('PRAGMA foreign_keys=OFF');
    await connection.synchronize();
    await connection.query('PRAGMA foreign_keys=ON');
    console.log('migrated')
  }
}