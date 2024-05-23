import { NotFoundException } from '@nestjs/common';

export class NotFoundGlobalSettingException extends NotFoundException {
  constructor() {
    const message = `Global Setting not found`;
    super(message);
  }
}
