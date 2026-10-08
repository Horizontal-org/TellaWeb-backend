import { NotFoundException } from '@nestjs/common';

export class NotFoundBackupException extends NotFoundException {
  constructor(backupId: string) {
    const message = `Backup with id ${backupId} was not found or is not ready.`;
    super(message);
  }
}
