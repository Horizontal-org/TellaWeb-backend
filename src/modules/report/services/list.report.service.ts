import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PartialResult } from 'common/dto/partial-result.common.dto';
import { applySort, SortableColumns } from 'common/utils/sort.utils';
import { RolesUser } from 'modules/user/domain';
import { ReadUserDto } from 'modules/user/dto';

import { ReportEntity } from '../domain';
import { IListReportService } from '../interfaces';

const SORTABLE: SortableColumns = {
  'report.title': 'report.title',
  'report.createdAt': 'report.createdAt',
  'author.username': 'author.username',
};

@Injectable()
export class ListReportService implements IListReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
  ) {}

  async execute(
    take: number,
    skip: number,
    sort: string,
    order: string,
    search: string,
    projectId: string,
    user: ReadUserDto,
  ): Promise<PartialResult<ReportEntity>> {
    const query = this.reportRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.files', 'files')
      .innerJoinAndSelect('report.author', 'author')
      // 0 = no limit / no offset, as in TypeORM 0.2 (0.3 sends LIMIT 0 / OFFSET 0)
      .skip(skip || undefined)
      .take(take || undefined);

    // Non-admins only see reports of projects they're a member of
    if (user.role !== RolesUser.ADMIN) {
      query
        .innerJoin('report.project', 'memberProject')
        .innerJoin('memberProject.users', 'member', 'member.id = :userId', {
          userId: user.id,
        });
    }

    // Optional: only the reports of one project (the project page's list)
    if (projectId && projectId.length > 0) {
      query.andWhere('report.project = :projectId', { projectId });
    }

    if (search && search.length > 0) {
      query.andWhere(
        '(report.title like :search OR report.description like :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    applySort(query, sort, order, SORTABLE);

    const [reports, total] = await query.getManyAndCount();
    return {
      total: total,
      results: reports,
    };
  }
}
