import { NotFoundException } from '@nestjs/common';

export class ReportNotFound extends NotFoundException {
  constructor(reportId: string) {
    const message = `Report with id ${reportId} was not found.`;
    super(message);
  }
}
