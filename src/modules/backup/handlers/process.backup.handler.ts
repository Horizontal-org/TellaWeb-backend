import { Injectable } from '@nestjs/common';

import {
  existsSync,
  mkdirSync,
  readdirSync,
  createWriteStream,
  copyFileSync,
  rmSync
} from 'fs';
import * as path from 'path';
import { join } from 'path';
import mysqldump from 'mysqldump'
import * as archiver from 'archiver'

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
    private emailQueue: Queue
  ) {}

  private basePath = join(process.cwd(), 'backups');
  private dataPath = join(process.cwd(), 'data')
  private backupDir = ''

  async process(processData: ProcessBackupDto): Promise<void> {
    try {
      const datetime = new Date()
      this.backupDir = path.join(this.basePath, `${datetime.toISOString().slice(0,19)}-backup`);    
      await this.createBackupFolder()
  
      // csvs 
      await this.parseUsersCsv()
      await this.parseProjectsCsv() 
      await this.parseReportsCsv()
      await this.parseResourcesCsv()
      // sql dump
      await this.createDatabaseDump()
      // files
      await this.parseFiles()
      // compress folder
      await this.compress()
      //delete folder and keep zip
      await this.clean()

      processData.backup.status = 'finished'
      processData.backup.folderName = this.backupDir
      await this.backupRepo.save(processData.backup)
      console.log('finished')

      // send email that backup is ready
      if (processData.emailEnabled) {
        this.emailQueue.add('send', {
          subject: 'Backup ready',
          to: processData.receiver,
          template: 'backup-processed',
          data: {        
            url: process.env.ADMIN_DOMAIN
          }
        })
      }
    } catch (e) {
      processData.backup.status = 'error'
      await this.backupRepo.save(processData.backup)
      console.log('error in execution => ', e)
    }    
  }

  private async compress() {
    console.log('STARTING COMPRESSION')
    // create a file to stream archive data to.
    const output = createWriteStream(this.backupDir + '.zip');    
    const archive = archiver('zip', { zlib: { level: 9 }});
  
    await new Promise<void>((resolve, reject) => {
      archive
        .directory(this.backupDir + '/', false)
        .on('error', err => reject(err))
        .pipe(output)
      ;
  
      output.on('close', () => {
        console.log(archive.pointer() + " total bytes")
        console.log('COMPRESSION FINISHED')
        resolve()
      });
      archive.finalize();
    });
    
  }

  private async clean()  {
    // remove uncompressed folder
    rmSync(this.backupDir, { recursive: true })
  }

  private async createBackupFolder() {
    if (existsSync(this.backupDir)) return;
    mkdirSync(this.backupDir, { mode: 0o755, recursive: true })    
  }

  private async parseFiles() {
    const fileCount = await getConnection()
      .createQueryBuilder()
      .from(FileEntity, 'file_entity')
      .leftJoin("report_entity", "report", "file_entity.reportId = report.id")
      .where('report.projectId IS NOT NULL')
      .getCount()
    
    const reports = await getConnection()
      .createQueryBuilder()
      .from(ReportEntity, 'report_entity')
      .leftJoin("project_entity", "project", "report_entity.projectId = project.id")
      .where('report_entity.projectId IS NOT NULL')
      .select('report_entity.id, project.name as project_name, report_entity.title as report_title')
      .orderBy('project.name')
      .getRawMany()

    this.iterateReports(reports, fileCount)
  }

  private async iterateReports(reports, fileCount) {
    let filesCopied = 0

    reports.forEach(async(r) => {
      const reportDir = path.join(this.backupDir, `${r.project_name}`, `${r.report_title}`);    

      //check if folder exists and if not create it
      if (!existsSync(reportDir)) {
        mkdirSync(reportDir, { mode: 0o755, recursive: true })    
      }
      
      // get report folder
      const folderDir = path.join(this.dataPath, r.id, 'full')

      // checks that report has files
      if (existsSync(folderDir)) {
        // count files
        const folderFiles = readdirSync(path.join(this.dataPath, r.id, 'full'))
        
        folderFiles.forEach((f, i) => {
          const filePath = path.join(folderDir, f)
          const destPath = path.join(reportDir, f)
          copyFileSync(filePath, destPath)

          filesCopied += 1
          console.log('FILES COPIED => ', `${filesCopied} out of ${fileCount}`)
        })
      }
      
    })
  }

  //NON DATA PROCESSES
  private async createDatabaseDump() {
    const res = await mysqldump({
      connection: {
        host: process.env.MYSQL_HOST,
        user: 'root',
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      },
      dumpToFile: this.backupDir + '/database_dump.sql',
    })
    console.log(res)
  }


  private async parseProjectsCsv() {
    const rawProjects = await getConnection()
      .createQueryBuilder()
      .from(ProjectEntity, 'project_entity')
      .leftJoin("report_entity", "report", "report.projectId = project_entity.id")
      .select("COUNT(report.id) as report_count, project_entity.*")
      .groupBy('project_entity.id')
      .getRawMany()

    await this.createCsv(
      rawProjects,
      ['id', 'name', 'report_count', 'created_at'],
      ['ID', 'NAME', 'REPORTS', 'CREATION DATE'],
      '/projects.csv'
    )
  }

  private async parseResourcesCsv() {
    const rawResources = await getConnection()
      .createQueryBuilder()
      .from(ResourceEntity, 'resource_entity')
      .getRawMany()

    await this.createCsv(
      rawResources,
      ['id', 'title', 'type', 'created_at'],
      ['ID', 'TITLE', 'TYPE', 'CREATION DATE'],
      '/resources.csv'
    )
  }

  private async parseReportsCsv() {
    const rawReports = await getConnection()
      .createQueryBuilder()
      .from(ReportEntity, 'report_entity')
      .innerJoin("user_entity", "user", "report_entity.authorId = user.id")
      .select("user.username as authorName, report_entity.*")
      .getRawMany()
    
    await this.createCsv(
      rawReports,
      ['id', 'title', 'description', 'projectId', 'authorId', 'authorName', 'created_at'],
      ['ID', 'TITLE', 'DESCRIPTION', 'PROJECT ID', 'AUTHOR ID', 'AUTHOR NAME', 'CREATION DATE'],
      '/reports.csv'
    )
  }

  private async parseUsersCsv() {
    const rawUsers = await getConnection()
      .createQueryBuilder()
      .from(UserEntity, 'user_entity')
      .getRawMany()

    await this.createCsv(
      rawUsers,
      ['id', 'username', 'role', 'note', 'created_at'],
      ['ID', 'NAME', 'ROLE', 'NOTE', 'CREATION DATE'],
      '/users.csv'
    )
  }
  
  private async createCsv(elements, elementKeys, elementHeaders, filename) {
    const writeStream = createWriteStream(this.backupDir + filename)
    writeStream.write(elementHeaders.join(',')+ '\n', () => {})

    elements.forEach((element) => {     
        const newLine = []
        elementKeys.forEach(e => newLine.push(element[e]))
        writeStream.write(newLine.join(',')+ '\n', () => {})
    })
  
    writeStream.end()
    writeStream.on('finish', () => {
        console.log('finish write stream, moving along')
    }).on('error', (err) => {
        console.log(err)
    })
  }

}



