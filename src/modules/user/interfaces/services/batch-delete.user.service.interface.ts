export interface IBatchDeleteUsersService {
  execute(toDelete: Array<string>): Promise<boolean>;
}
