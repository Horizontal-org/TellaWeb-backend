import { Inject, Injectable } from '@nestjs/common';
import { StreamFileDto } from '../dto/stream.file.dto';
import {
  IStreamFileService,
  IGetAssetFileApplication,
  IGetByIdFileApplication,
  TYPES,
} from '../interfaces';

@Injectable()
export class GetAssetFileApplication implements IGetAssetFileApplication {
  constructor(
    @Inject(TYPES.applications.IGetByIdFileApplication)
    private readonly getByIdFileApplication: IGetByIdFileApplication,
    @Inject(TYPES.services.IStreamFileService)
    private readonly streamFileService: IStreamFileService,
  ) {}

  async execute(fileId: string, range?: string): Promise<StreamFileDto> {
    const file = await this.getByIdFileApplication.execute(fileId);
    const streamResponse = await this.streamFileService.execute(file, range);

    return streamResponse;
  }
}
