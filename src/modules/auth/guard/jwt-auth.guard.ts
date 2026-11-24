import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { InvalidSessionException } from 'common/exceptions/invalid-session.exception'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // info is a TokenExpiredError, JsonWebTokenError or "No auth token" error
    if (err || !user) throw new InvalidSessionException(info?.message)
    return user
  }
}
