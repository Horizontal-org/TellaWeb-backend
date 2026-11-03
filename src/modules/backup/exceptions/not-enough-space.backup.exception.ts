import { HttpException, HttpStatus } from '@nestjs/common';

const gb = (bytes: number) => (bytes / 1024 ** 3).toFixed(1);

// nest has no built-in exception for 507
export class NotEnoughSpaceBackupException extends HttpException {
  constructor(needed: number, available: number) {
    super(
      `Not enough disk space for a backup: it needs about ${gb(needed)} GB and ${gb(available)} GB are available.`,
      HttpStatus.INSUFFICIENT_STORAGE,
    );
  }
}
