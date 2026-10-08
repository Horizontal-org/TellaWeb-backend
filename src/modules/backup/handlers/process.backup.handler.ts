import { Injectable } from '@nestjs/common';

import { createWriteStream, promises as fsp } from 'fs';
import * as path from 'path';
import { join } from 'path';
import mysqldump from 'mysqldump';
import * as archiver from 'archiver';

import { IProcessBackupHandler } from '../interfaces/handlers/process.backup.handler.interface';
import { getConnection, Repository } from 'typeorm';
import { ProjectEntity } from 'modules/project/domain';
import { ReportEntity } from 'modules/report/domain';
import { UserEntity } from 'modules/user/domain';
import { ResourceEntity } from 'modules/resource/domain';
import { FileEntity } from 'modules/file/domain';
import { InjectRepository } from '@nestjs/typeorm';
import { BackupEntity } from '../domain';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ProcessBackupDto } from '../dto/process.backup.dto';

@Injectable()
export class ProcessBackupHandler implements IProcessBackupHandler {
  constructor(
    @InjectRepository(BackupEntity)
    private readonly backupRepo: Repository<BackupEntity>,
    @InjectQueue('emails')
    private emailQueue: Queue,
  ) {}

  private basePath = join(process.cwd(), 'backups');
  private dataPath = join(process.cwd(), 'data');
  private backupDir = '';

  async process(processData: ProcessBackupDto): Promise<void> {
    try {
      const datetime = new Date();
      this.backupDir = path.join(
        this.basePath,
        `${datetime.toISOString().slice(0, 19)}-backup`,
      );
      await this.createBackupFolder();

      // csvs
      await this.parseUsersCsv();
      await this.parseProjectsCsv();
      await this.parseReportsCsv();
      await this.parseResourcesCsv();
      // sql dump
      await this.createDatabaseDump();
      // files
      await this.parseFiles();
      // compress folder
      await this.compress();
      //delete folder and keep zip
      await this.clean();

      processData.backup.status = 'finished';
      processData.backup.folderName = this.backupDir;
      await this.backupRepo.save(processData.backup);
      console.log('finished');

      // send email that backup is ready
      if (processData.emailEnabled) {
        this.emailQueue.add('send', {
          subject: 'Backup ready',
          to: processData.receiver,
          template: 'backup-processed',
          data: {
            url: process.env.ADMIN_DOMAIN,
          },
        });
      }
    } catch (e) {
      console.log('error in execution => ', e);
      await this.removePartialBackup();
      try {
        processData.backup.status = 'error';
        await this.backupRepo.save(processData.backup);
      } catch (saveError) {
        console.log('could not mark backup as error => ', saveError);
      }
    }
  }

  // a failed backup leaves a half copied folder and/or a partial zip behind;
  // when the failure was a full disk, keeping them means the next one fails too
  private async removePartialBackup() {
    if (!this.backupDir) return;
    await Promise.all([
      fsp.rm(this.backupDir, { recursive: true, force: true }),
      fsp.rm(this.backupDir + '.zip', { force: true }),
    ]).catch((e) => console.log('could not remove partial backup => ', e));
  }

  private async compress() {
    console.log('STARTING COMPRESSION');
    // create a file to stream archive data to.
    const output = createWriteStream(this.backupDir + '.zip');
    // most of the content is media that is already compressed, so a high
    // level only burns CPU on the shared libuv threadpool for almost no gain
    const archive = archiver('zip', { zlib: { level: 1 } });

    await new Promise<void>((resolve, reject) => {
      archive
        .directory(this.backupDir + '/', false)
        .on('error', (err) => reject(err))
        .pipe(output);

      output.on('close', () => {
        console.log(archive.pointer() + ' total bytes');
        console.log('COMPRESSION FINISHED');
        resolve();
      });
      // without this listener a write error (e.g. ENOSPC) is an unhandled
      // 'error' event that kills the whole process and skips the catch
      output.on('error', (err) => {
        archive.abort();
        reject(err);
      });
      archive.finalize();
    });
  }

  private async clean() {
    // remove uncompressed folder
    await fsp.rm(this.backupDir, { recursive: true });
  }

  private async createBackupFolder() {
    await fsp.mkdir(this.backupDir, { mode: 0o755, recursive: true });
  }

  private async parseFiles() {
    const fileCount = await getConnection()
      .createQueryBuilder()
      .from(FileEntity, 'file_entity')
      .leftJoin('report_entity', 'report', 'file_entity.reportId = report.id')
      .where('report.projectId IS NOT NULL')
      .getCount();

    const reports = await getConnection()
      .createQueryBuilder()
      .from(ReportEntity, 'report_entity')
      .leftJoin(
        'project_entity',
        'project',
        'report_entity.projectId = project.id',
      )
      .where('report_entity.projectId IS NOT NULL')
      .select(
        'report_entity.id, project.name as project_name, report_entity.title as report_title',
      )
      .orderBy('project.name')
      .getRawMany();

    await this.iterateReports(reports, fileCount);
  }

  // Copies run one at a time with fs.promises so the event loop stays free
  // between files; sync copies here used to block every HTTP request.
  private async iterateReports(reports, fileCount) {
    let filesCopied = 0;

    for (const r of reports) {
      const reportDir = path.join(
        this.backupDir,
        `${r.project_name}`,
        `${r.report_title}`,
      );
      await fsp.mkdir(reportDir, { mode: 0o755, recursive: true });

      // get report folder
      const folderDir = path.join(this.dataPath, r.id, 'full');

      let folderFiles: string[];
      try {
        folderFiles = await fsp.readdir(folderDir);
      } catch (e) {
        // report has no files
        if (e.code === 'ENOENT') continue;
        throw e;
      }

      for (const f of folderFiles) {
        await fsp.copyFile(path.join(folderDir, f), path.join(reportDir, f));
        filesCopied += 1;
      }
    }

    console.log('FILES COPIED => ', `${filesCopied} out of ${fileCount}`);
  }

  //NON DATA PROCESSES
  private async createDatabaseDump() {
    // don't log the result: it holds the whole dump, and writing it to stdout
    // is synchronous inside docker
    await mysqldump({
      connection: {
        host: process.env.MYSQL_HOST,
        port: +process.env.MYSQL_PORT || 3306,
        user: 'root',
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      },
      dumpToFile: this.backupDir + '/database_dump.sql',
    });
  }

  private async parseProjectsCsv() {
    const rawProjects = await getConnection()
      .createQueryBuilder()
      .from(ProjectEntity, 'project_entity')
      .leftJoin(
        'report_entity',
        'report',
        'report.projectId = project_entity.id',
      )
      .select('COUNT(report.id) as report_count, project_entity.*')
      .groupBy('project_entity.id')
      .getRawMany();

    await this.createCsv(
      rawProjects,
      ['id', 'name', 'report_count', 'created_at'],
      ['ID', 'NAME', 'REPORTS', 'CREATION DATE'],
      '/projects.csv',
    );
  }

  private async parseResourcesCsv() {
    const rawResources = await getConnection()
      .createQueryBuilder()
      .from(ResourceEntity, 'resource_entity')
      .getRawMany();

    await this.createCsv(
      rawResources,
      ['id', 'title', 'type', 'created_at'],
      ['ID', 'TITLE', 'TYPE', 'CREATION DATE'],
      '/resources.csv',
    );
  }

  private async parseReportsCsv() {
    const rawReports = await getConnection()
      .createQueryBuilder()
      .from(ReportEntity, 'report_entity')
      .innerJoin('user_entity', 'user', 'report_entity.authorId = user.id')
      .select('user.username as authorName, report_entity.*')
      .getRawMany();

    await this.createCsv(
      rawReports,
      [
        'id',
        'title',
        'description',
        'projectId',
        'authorId',
        'authorName',
        'created_at',
      ],
      [
        'ID',
        'TITLE',
        'DESCRIPTION',
        'PROJECT ID',
        'AUTHOR ID',
        'AUTHOR NAME',
        'CREATION DATE',
      ],
      '/reports.csv',
    );
  }

  private async parseUsersCsv() {
    const rawUsers = await getConnection()
      .createQueryBuilder()
      .from(UserEntity, 'user_entity')
      .getRawMany();

    await this.createCsv(
      rawUsers,
      ['id', 'username', 'role', 'note', 'created_at'],
      ['ID', 'NAME', 'ROLE', 'NOTE', 'CREATION DATE'],
      '/users.csv',
    );
  }

  private async createCsv(elements, elementKeys, elementHeaders, filename) {
    const writeStream = createWriteStream(this.backupDir + filename);
    writeStream.write(elementHeaders.join(',') + '\n', () => {});

    elements.forEach((element) => {
      const newLine = [];
      elementKeys.forEach((e) => newLine.push(element[e]));
      writeStream.write(newLine.join(',') + '\n', () => {});
    });

    // wait for the file to be flushed so the zip never picks up a partial csv
    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', resolve).on('error', reject);
      writeStream.end();
    });
  }
}
