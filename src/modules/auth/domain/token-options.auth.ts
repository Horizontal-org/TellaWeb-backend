import { JwtSignOptions } from '@nestjs/jwt';
import { ReadUserDto } from 'modules/user/dto';

export default interface TokenOptions {
  user: ReadUserDto;
  // a duration like '15m' or '1y', or seconds
  expiresIn: JwtSignOptions['expiresIn'];
  type: string;
}
