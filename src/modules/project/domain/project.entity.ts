import { ReportEntity } from 'modules/report/domain';
import { UserEntity } from 'modules/user/domain';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  BeforeRemove,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150 })
  slug: string;

  @OneToMany(() => ReportEntity, (report: ReportEntity) => report.project, {
    cascade: true,
    eager: true,
  })
  reports: ReportEntity[];

  @ManyToMany(() => UserEntity, user => user.projects)
  @JoinTable({
    name: 'projects_users',
    joinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    }
  })
  users: UserEntity[];


  @Column({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @BeforeInsert()
  private beforeInsert(): void {
    this.createdAt = new Date();
  }

}