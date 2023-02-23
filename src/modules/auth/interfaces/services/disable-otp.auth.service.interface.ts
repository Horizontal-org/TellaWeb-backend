
export interface IDisableOtpAuthService {
  execute(userId: string): Promise<void>;
}
