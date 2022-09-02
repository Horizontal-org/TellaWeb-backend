export interface IDeleteByIdProjectApplication {
  execute(projectId: string): Promise<boolean>;
}
