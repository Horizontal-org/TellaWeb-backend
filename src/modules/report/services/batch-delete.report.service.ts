import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IBatchDeleteReportService } from '../interfaces';
import { ReportEntity } from '../domain';
import {
  IDeleteBucketFileApplication,
  TYPES as TYPES_FILE,
} from 'modules/file/interfaces';
import { FileEntity } from 'modules/file/domain';

@Injectable()
export class BatchDeleteReportService implements IBatchDeleteReportService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,
    @Inject(TYPES_FILE.applications.IDeleteBucketFileApplication)
    private deleteBucketFileApplication: IDeleteBucketFileApplication,
  ) {}

  async execute(toDelete: Array<string>): Promise<boolean> {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(FileEntity)
      .where('report.id IN (:...toDelete)', { toDelete: toDelete })
      .execute();

    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(ReportEntity)
      .where('id IN (:...toDelete)', { toDelete: toDelete })
      .execute();

    await toDelete.forEach(async (id) => {
      await this.deleteBucketFileApplication.execute(id);
    });
    return true;
  }
}
