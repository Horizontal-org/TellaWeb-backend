export interface IUnblockUserService {
  execute(code: string, ip: string): Promise<boolean>;
}
