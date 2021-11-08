import { InternalServerErrorException } from '@nestjs/common';

export class CantBeClosedFileException extends InternalServerErrorException {
  constructor(fileName: string) {
    const message = `Error closing ${fileName}`;
    super(message);
  }
}
