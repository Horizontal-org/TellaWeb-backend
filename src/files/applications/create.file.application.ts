import { Inject, Injectable } from '@nestjs/common';
import { FileInputStreamDto } from '../dto/file-input.dto';
import { ICreateFileApplication } from '../interfaces/applications/create.file.application.interface';
import { IStoreFileService } from '../interfaces/services/store.file.service.interface';
import { TYPES } from '../interfaces/types';
import { FileDto } from 'files/dto/file.dto';

@Injectable()
export class CreateFileApplication implements ICreateFileApplication {
  constructor(
    @Inject(TYPES.services.IStoreFileService)
    private readonly storeFileService: IStoreFileService,
  ) {}

  async execute(fileInputStreamDto: FileInputStreamDto): Promise<FileDto> {
    return this.storeFileService.execute(fileInputStreamDto);
  }
}
