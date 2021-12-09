import { Inject, Injectable } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IDeleteByIdReportService } from '../interfaces';
import { ReportEntity } from '../domain';
import {
  IDeleteBucketFileApplication,
  TYPES as TYPES_FILE,
} from 'modules/file/interfaces';
import { FileEntity } from 'modules/file/domain';

@Injectable()
export class DeleteByIdReportService implements IDeleteByIdReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,
    @Inject(TYPES_FILE.applications.IDeleteBucketFileApplication)
    private deleteBucketFileApplication: IDeleteBucketFileApplication,
  ) {}

  async execute(reportId: string): Promise<boolean> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(FileEntity)
      .where('report.id = :reportId', { reportId: reportId })
      .execute();

    const { affected } = await this.reportRepository.delete({ id: reportId });
    if (affected === 0) return false;
    await this.deleteBucketFileApplication.execute(reportId);
    return true;
  }
}
