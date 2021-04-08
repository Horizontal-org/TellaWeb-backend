import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PartialResult } from 'common/dto/partial-result.common.dto';

import { ReportEntity } from '../domain';
import { IListReportService } from '../interfaces';

@Injectable()
export class ListReportService implements IListReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
  ) {}

  async execute(
    take: number,
    skip: number,
  ): Promise<PartialResult<ReportEntity>> {
    const [reports, total] = await this.reportRepository.findAndCount({
      take,
      skip,
    });

    return {
      total: total,
      results: reports,
    };
  }
}
