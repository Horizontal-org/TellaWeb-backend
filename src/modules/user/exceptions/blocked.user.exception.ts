import { ForbiddenException } from '@nestjs/common';

export class BlockedUserException extends ForbiddenException {
  constructor() {
    super('Account blocked. Check your email to unblock it.');
  }
}
