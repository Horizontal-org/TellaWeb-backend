import { InternalServerErrorException } from '@nestjs/common';

export class FileCantBeClosed extends InternalServerErrorException {
  constructor(fileName: string) {
    const message = `Error closing ${fileName}`;
    super(message);
  }
}
