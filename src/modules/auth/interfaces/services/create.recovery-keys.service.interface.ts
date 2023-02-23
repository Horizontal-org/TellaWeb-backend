export interface ICreateRecoveryKeysService {
  execute(userId): Promise<string[]>;
}
