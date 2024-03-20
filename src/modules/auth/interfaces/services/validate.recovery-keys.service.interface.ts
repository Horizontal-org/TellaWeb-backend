export interface IValidateRecoveryKeysService {
  execute(userId, code): Promise<void>;
}
