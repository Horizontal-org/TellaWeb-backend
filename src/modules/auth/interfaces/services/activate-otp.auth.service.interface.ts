export interface IActivateOtpAuthService {
  execute(userId): Promise<void>;
}
