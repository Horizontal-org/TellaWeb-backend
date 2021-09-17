import { NotFoundException } from '@nestjs/common';

export class NotFoundRemoteConfigurationException extends NotFoundException {
  constructor(shortCode: string) {
    const message = `Configuration with short code ${shortCode} not found.`;
    super(message);
  }
}
