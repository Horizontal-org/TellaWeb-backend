
export interface IOtpAuthHandler {
  generate(): void;
  createQR(username: string, service: string, secret: string): string
  verify(token, secret): boolean
}
