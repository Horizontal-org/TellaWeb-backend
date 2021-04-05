import { User } from 'user/domain/user.entity';

export interface CreateReportDto {
  title: string;
  description: string;
  author: User;
}
