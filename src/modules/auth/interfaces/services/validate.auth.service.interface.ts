import { LoginAuthDto } from 'modules/auth/domain/login.auth.dto';
import { ReadUserDto } from 'modules/user/dto';

export interface IValidateAuthService {
  execute({ username, password }: LoginAuthDto): Promise<ReadUserDto>;
}
