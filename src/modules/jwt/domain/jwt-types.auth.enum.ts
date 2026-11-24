export enum JwtTypes {
  WEB = 'web',
  MOBILE = 'mobile',
  ALL = 'all',
  // only proves the password step of a 2FA login, never a session
  MFA = 'mfa',
}
