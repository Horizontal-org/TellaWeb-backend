import { Inject, Injectable } from '@nestjs/common';

import { FileDto, WriteStreamFileDto } from '../dto';
import {
  TYPES,
  IStoreFileService,
  ICreateFileApplication,
} from '../interfaces';

@Injectable()
export class CreateFileApplication implements ICreateFileApplication {
  constructor(
    @Inject(TYPES.services.IStoreFileService)
    private readonly storeFileService: IStoreFileService,
  ) {}

  async execute(fileInputStreamDto: WriteStreamFileDto): Promise<FileDto> {
    return this.storeFileService.execute(fileInputStreamDto);
  }
}
