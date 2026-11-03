import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { RolesUser, UserEntity } from 'modules/user/domain';
import { ReportEntity } from '../domain';

// How many of reportIds belong to a project the user is a member of
export function countAccessibleReports(
  dataSource: DataSource,
  userId: string,
  reportIds: string[],
): Promise<number> {
  if (reportIds.length === 0) return Promise.resolve(0);
  return dataSource
    .createQueryBuilder()
    .from(ReportEntity, 'report')
    .innerJoin('report.project', 'project')
    .innerJoin('project.users', 'users')
    .where('report.id IN (:...reportIds)', { reportIds })
    .andWhere('users.id = :userId', { userId })
    .getCount();
}

// Non-admins can only reach reports of their own projects. A missing report,
// or one with no project, also fails, so the 403 doesn't reveal it exists.
@Injectable()
export class ReportAccessGuard implements CanActivate {
  constructor(private readonly dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;
    if (!user) return false;
    if (user.role === RolesUser.ADMIN) return true;

    const { reportId } = request.params;
    if (!reportId) return false;

    return (
      (await countAccessibleReports(this.dataSource, user.id, [reportId])) > 0
    );
  }
}
