export interface IVerifyMfaTokenAuthService {
  // returns the user id the token was issued for
  execute(token: string): Promise<string>;
}
