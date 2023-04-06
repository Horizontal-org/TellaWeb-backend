
export interface IHandleWhitelistUserService {
  execute(
    location: string,
    userId: string
  ): Promise<boolean>;
}
