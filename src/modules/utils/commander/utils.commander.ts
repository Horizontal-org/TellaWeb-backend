import { Inject, Injectable } from '@nestjs/common';
import { ConsoleService } from 'nestjs-console';
import { DataSource } from 'typeorm';

import { IMailUtilService, TYPES } from '../interfaces';

@Injectable()
export class UtilsCommander {
  constructor(
    private readonly consoleService: ConsoleService,
    private readonly dataSource: DataSource,
    @Inject(TYPES.services.IMailUtilService)
    private readonly mailUtilService: IMailUtilService,
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

    this.consoleService.createCommand(
      {
        command: 'send-test-email <to>',
        description: 'Send a test email to check the SMTP config',
      },
      (to) => this.sendTestEmail(to),
      groupCommand,
    );
  }

  // sends directly instead of through the emails queue, so errors show here
  async sendTestEmail(to: string) {
    await this.mailUtilService.send({
      to,
      subject: 'Tella Web test email',
      template: 'test-email',
    });
    console.log(`Test email sent to ${to}`);
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
