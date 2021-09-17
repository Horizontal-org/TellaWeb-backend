import { NotFoundException } from '@nestjs/common';

export class NotFoundRemoteConfigurationException extends NotFoundException {
  constructor(shortCode: string) {
    const message = `Configuration with shortCode or id ${shortCode} not found.`;
    super(message);
  }
}
