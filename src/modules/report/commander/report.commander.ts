import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConsoleService } from 'nestjs-console';
import * as prompt from 'prompt';
import { IsNull, LessThan, Repository } from 'typeorm';

import { ReportEntity } from '../domain';
import { IBatchDeleteReportService, TYPES } from '../interfaces';

@Injectable()
export class ReportCommander {
  constructor(
    private readonly consoleService: ConsoleService,
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
    @Inject(TYPES.services.IBatchDeleteReportService)
    private readonly batchDeleteReportService: IBatchDeleteReportService,
  ) {
    const cli = this.consoleService.getCli();
    const groupCommand = this.consoleService.createGroupCommand(
      {
        command: 'reports',
        description: 'Report maintenance',
      },
      cli,
    );

    this.consoleService.createCommand(
      {
        command: 'clean-orphans <days>',
        description:
          'Delete reports (and their files) with no project, older than <days>',
        options: [
          { flags: '--dry-run', description: 'Only list, delete nothing' },
        ],
      },
      (days, cmd) => this.cleanOrphans(days, cmd.dryRun),
      groupCommand,
    );
  }

  async cleanOrphans(days: string, dryRun: boolean) {
    const n = Number(days);
    if (!Number.isInteger(n) || n < 0) {
      console.log('<days> must be a non-negative integer');
      return;
    }

    const before = new Date(Date.now() - n * 24 * 60 * 60 * 1000);
    const reports = await this.reportRepository.find({
      where: { project: IsNull(), createdAt: LessThan(before) },
      select: { id: true, title: true, createdAt: true },
    });

    reports.forEach((r) =>
      console.log(`${r.id}  ${r.createdAt.toISOString()}  ${r.title}`),
    );
    console.log(
      `${reports.length} report(s) without project created before ${before.toISOString()}`,
    );
    if (dryRun || reports.length === 0) return;

    prompt.start();
    const { confirm } = await prompt.get([
      { name: 'confirm', description: 'Delete them? (yes/no)' },
    ]);
    if (confirm.toString() !== 'yes') {
      console.log('Aborted');
      return;
    }

    await this.batchDeleteReportService.execute(reports.map((r) => r.id));
    console.log(`Deleted ${reports.length} report(s)`);
  }
}
