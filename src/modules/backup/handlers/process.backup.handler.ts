import { Injectable } from '@nestjs/common';

import {
  existsSync,
  mkdirSync,
  renameSync,
  statSync,
  createReadStream,
  ReadStream,
  readdirSync,
  unlinkSync,
  rmSync,
  createWriteStream,
} from 'fs';
import * as path from 'path';
import { join } from 'path';
import mysqldump from 'mysqldump'

import { IProcessBackupHandler } from '../interfaces/handlers/process.backup.handler.interface';
import { ReadUserDto } from 'modules/user/dto';
import { getConnection } from 'typeorm';
import { ProjectEntity } from 'modules/project/domain';
import { ReportEntity } from 'modules/report/domain';
import { UserEntity } from 'modules/user/domain';
import { ResourceEntity } from 'modules/resource/domain';

@Injectable()
export class ProcessBackupHandler implements IProcessBackupHandler {
  private basePath = join(process.cwd(), 'backups');
  private backupDir = ''

  async process(user: ReadUserDto): Promise<void> {
    const datetime = new Date()
    this.backupDir = path.join(this.basePath, `${datetime.toISOString().slice(0,10)}-backup`);    
    console.log('we are going to process here')        
    await this.createBackupFolder()

    // csvs 
    await this.parseUsersCsv()
    await this.parseProjectsCsv() 
    await this.parseReportsCsv()
    await this.parseResourcesCsv()
    // sql dump
    // await this.createDatabaseDump()
  }


  private async createBackupFolder() {
    console.log("🚀 ~ ProcessBackupHandler ~ createBackupFolder ~ reportDir:", this.backupDir)
    if (existsSync(this.backupDir)) return;
    mkdirSync(this.backupDir, { mode: 0o755, recursive: true })    
  }

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
    let writeStream = createWriteStream(this.backupDir + filename)
    writeStream.write(elementHeaders.join(',')+ '\n', () => {})

    elements.forEach((element) => {     
        let newLine = []
        elementKeys.forEach(e => newLine.push(element[e]))
        writeStream.write(newLine.join(',')+ '\n', () => {})
    })
  
    console.log('WRITESTREAM')
    writeStream.end()
    writeStream.on('finish', () => {
        console.log('finish write stream, moving along')
    }).on('error', (err) => {
        console.log(err)
    })
  }
  
}



