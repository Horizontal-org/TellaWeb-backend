import { MethodNotAllowedException } from '@nestjs/common';

export class BackupAlreadyInProgressException extends MethodNotAllowedException {
  constructor() {
    super("Backup already in progress");
  }
}
