import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IDeleteByIdProjectService } from '../interfaces';
import { ProjectEntity } from '../domain';
import { ReportEntity } from 'modules/report/domain';
import {
  IBatchDeleteReportService,
  TYPES as TYPES_REPORT,
} from 'modules/report/interfaces';

@Injectable()
export class DeleteByIdProjectService implements IDeleteByIdProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,
    @Inject(TYPES_REPORT.services.IBatchDeleteReportService)
    private batchDeleteReportService: IBatchDeleteReportService,
  ) {}

  async execute(projectId: string): Promise<boolean> {
    const reports = await this.reportRepository.find({
      where: { project: { id: projectId } },
      select: { id: true },
    });
    await this.batchDeleteReportService.execute(reports.map((r) => r.id));

    const { affected } = await this.projectRepository.delete({ id: projectId });
    if (affected === 0) return false;
    return true;
  }
}
