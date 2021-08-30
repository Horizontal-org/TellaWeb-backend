import { ReadUserDto } from 'modules/user/dto';
import { JWTResponse } from '../../domain';

export interface IGenerateTokenAuthService {
  execute(user: ReadUserDto): Promise<JWTResponse>;
}
