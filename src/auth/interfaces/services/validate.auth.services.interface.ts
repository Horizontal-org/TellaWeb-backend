export interface IValidateAuthService<T> {
  execute(username: string, password: string): Promise<T | null>;
}
