import { ReadUserDto } from 'modules/user/dto';

export interface IRefreshTokenAuthService {
  generate(userId: string): Promise<string>;
  validate(token: string): Promise<{ userId: string }>;
  revoke(token: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
  cleanup(): Promise<void>;
}
