import { Inject, Injectable } from '@nestjs/common';

import { CloseFileDto } from '../dto';
import { TYPES, ICloseFileApplication, ICloseFileService } from '../interfaces';

@Injectable()
export class CloseFileApplication implements ICloseFileApplication {
  constructor(
    @Inject(TYPES.services.ICloseFileService)
    private readonly closeFileService: ICloseFileService,
  ) {}

  async execute(input: CloseFileDto): Promise<void> {
    await this.closeFileService.execute(input);
    return;
  }
}
