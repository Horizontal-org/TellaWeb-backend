import TokenOptions from 'modules/auth/domain/token-options.auth';
import { JWTResponse } from 'modules/jwt/domain/jwt-response.auth.ov';
import { ReadUserDto } from 'modules/user/dto';

export interface IGenerateTokenAuthService {
  execute(tokenOptions: TokenOptions): Promise<JWTResponse>;
}
