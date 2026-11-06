import { ConflictException } from '@nestjs/common';

export class AlreadyExistProjectException extends ConflictException {
  constructor(name: string) {
    const message = `Project ${name} already exist`;
    super(message);
  }
}

export class AlreadyExistSlugProjectException extends ConflictException {
  constructor(slug: string) {
    super(`URL ${slug} is already in use`);
  }
}
