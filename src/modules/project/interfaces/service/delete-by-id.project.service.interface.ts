export interface IDeleteByIdProjectService {
  execute(projectId: string): Promise<boolean>;
}
