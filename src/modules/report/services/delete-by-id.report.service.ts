import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IDeleteByIdReportService } from '../interfaces';
import { ReportEntity } from '../domain';
import {
  IDeleteBucketFileApplication,
  TYPES as TYPES_FILE,
} from 'modules/file/interfaces';

@Injectable()
export class DeleteByIdReportService implements IDeleteByIdReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,
    @Inject(TYPES_FILE.applications.IDeleteBucketFileApplication)
    private deleteBucketFileApplication: IDeleteBucketFileApplication,
  ) {}

  async execute(reportId: string): Promise<boolean> {
    const { affected } = await this.reportRepository.delete({ id: reportId });
    if (affected === 0) return false;
    await this.deleteBucketFileApplication.execute(reportId);
    return true;
  }
}
