export interface IGetRecoveryKeysService {
  execute(userId): Promise<string[]>;
}
