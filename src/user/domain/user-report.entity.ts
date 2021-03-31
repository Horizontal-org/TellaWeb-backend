import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from 'reports/domain/report.entity';
import { User } from './user.entity';

@Entity()
export class UserReport {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Report, { eager: true })
  reports: Report;
}
