import { UnauthorizedException } from '@nestjs/common'

// Code the web client looks for to decide whether a 401 should trigger /auth/refresh
export const INVALID_SESSION = 'INVALID_SESSION'

export class InvalidSessionException extends UnauthorizedException {
  constructor(message = 'Invalid or expired session') {
    super({ statusCode: 401, code: INVALID_SESSION, message })
  }
}
