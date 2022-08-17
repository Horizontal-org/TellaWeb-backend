import { Inject, Injectable } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IDeleteByIdProjectService } from '../interfaces';
import { ProjectEntity } from '../domain';
import { FileEntity } from 'modules/file/domain';
import { ReportEntity } from 'modules/report/domain';

@Injectable()
export class DeleteByIdProjectService implements IDeleteByIdProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,    
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,    
  ) {}

  async execute(projectId: string): Promise<boolean> {

    //TODO handle delete or null
    await getConnection()
      .createQueryBuilder()
      .update(ReportEntity)
      .set({ project: null })      
      .where("project = :projectId", { projectId })
      .execute()

    const { affected } = await this.projectRepository.delete({ id: projectId });
    if (affected === 0) return false;
    return true;
  }
}
