import { Injectable } from '@nestjs/common';
import { ConsoleService } from 'nestjs-console';
import { DataSource } from 'typeorm';

@Injectable()
export class UtilsCommander {
  constructor(
    private readonly consoleService: ConsoleService,
    private readonly dataSource: DataSource,
  ) {
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

  // Runs pending migrations from the compiled code (no ts-node), the same
  // ones as npm run typeorm:run. It used to run SQLite PRAGMA statements,
  // which fail on MySQL, and log the connection options, password included.
  async migrate() {
    try {
      const executed = await this.dataSource.runMigrations();
      if (executed.length === 0) {
        console.log('No migrations are pending');
      }
      executed.forEach((m) => console.log(`Executed migration ${m.name}`));
    } catch (e) {
      console.log('error migrating: ', e);
      throw e;
    }
  }
}
