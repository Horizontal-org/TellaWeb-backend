import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ReportEntity } from 'modules/report/domain/report.entity';
import { Exclude, Expose } from 'class-transformer';
import { ProjectEntity } from 'modules/project/domain';

@Exclude()
@Entity()
export class ResourceEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Expose()
  @Column()
  fileName: string;

  @ManyToMany(() => ProjectEntity, project => project.resources)
  @JoinTable({
    name: 'projects_resources',
    joinColumn: {
      name: 'resource_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    }
  })
  projects: ProjectEntity[];


  @Expose()
  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column()
  type: string;

  @BeforeInsert()
  private beforeInsert(): void {
    this.createdAt = new Date();
  }
}
