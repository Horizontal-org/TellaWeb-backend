export interface IBatchDeleteUsersApplication {
  execute(toDelete: Array<string>): Promise<boolean>;
}
