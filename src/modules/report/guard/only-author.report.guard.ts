import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';

import { UserEntity } from 'modules/user/domain';
import { IGetByIdReportApplication, TYPES } from '../interfaces';

@Injectable()
export class OnlyAuthor implements CanActivate {
  constructor(
    @Inject(TYPES.applications.IGetByIdReportApplication)
    private readonly getByIdReportApplication: IGetByIdReportApplication,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;
    if (!user) return false;

    const report = await this.getByIdReportApplication.execute(
      request.params.reportId,
    );

    if (!report || !report.author) return false;

    return report.author.id === user.id;
  }
}
