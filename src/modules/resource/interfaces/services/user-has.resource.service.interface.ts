
export interface IUserHasResourceService {
  execute(userId: string, fileName: string): Promise<boolean>;
}
