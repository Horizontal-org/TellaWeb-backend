import { ForbiddenException } from '@nestjs/common';

export class FileAlreadyClosed extends ForbiddenException {
  constructor(fileName: string) {
    const message = `The file ${fileName} is alredy closed`;
    super(message);
  }
}
