import { ReadUserDto, CredentialUserDto } from '../../dto';

export interface ICheckSuspiciousUserApplication {
  execute(ip, userId): Promise<boolean>;
}
