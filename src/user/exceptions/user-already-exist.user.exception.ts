import { ConflictException } from '@nestjs/common';

export class UserAlreadyExist extends ConflictException {
  constructor(username: string) {
    const message = `User ${username} already exist`;
    super(message);
  }
}
