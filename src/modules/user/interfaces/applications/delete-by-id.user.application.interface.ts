export interface IDeleteByIdUserApplication {
  execute(userId: string): Promise<boolean>;
}
