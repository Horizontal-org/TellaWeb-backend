import { NotFoundException } from '@nestjs/common';

export class NotFoundFileException extends NotFoundException {
  constructor(fileName: string) {
    const message = `File ${fileName} not found.`;
    super(message);
  }
}
