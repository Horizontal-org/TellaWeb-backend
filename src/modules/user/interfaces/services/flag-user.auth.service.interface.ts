import { UserEntity } from "modules/user/domain";

export interface IFlagUserAuthService {
  execute(
    user: UserEntity,
  ): Promise<string>;
}
