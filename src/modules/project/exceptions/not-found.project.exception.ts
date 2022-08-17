import { NotFoundException } from '@nestjs/common';

export class NotFoundProjectException extends NotFoundException {
  constructor(projectId: string) {
    const message = `Project with id ${projectId} was not found.`;
    super(message);
  }
}
