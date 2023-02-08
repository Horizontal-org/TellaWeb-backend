import { LoginAuthDto } from 'modules/auth/domain';
import { EnableOtpResponseAuthDto } from 'modules/auth/dto/enable-otp-response.auth.dto';

export interface IEnableOtpAuthService {
  execute({ username, password }: LoginAuthDto): Promise<EnableOtpResponseAuthDto>;
}
