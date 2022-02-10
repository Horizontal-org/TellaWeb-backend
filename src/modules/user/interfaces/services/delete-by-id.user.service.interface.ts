export interface IDeleteByIdUserService {
  execute(userId: string): Promise<boolean>;
}
