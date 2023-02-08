export interface IVerifyOtpAuthService {
  execute(code, userId): Promise<void>;
}
