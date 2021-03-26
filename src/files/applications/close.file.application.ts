import { Inject, Injectable } from '@nestjs/common';
import { FileInputDto } from '../dto/file-input.dto';
import { ICloseFileApplication } from '../interfaces/applications/close.file.application.interface';
import { ICloseFileService } from '../interfaces/services/close.file.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class CloseFileApplication implements ICloseFileApplication {
  constructor(
    @Inject(TYPES.services.ICloseFileService)
    private readonly closeFileService: ICloseFileService,
  ) {}

  async execute(input: FileInputDto): Promise<void> {
    await this.closeFileService.execute(input);
    return;
  }
}
