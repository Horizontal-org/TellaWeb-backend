import { Inject, Injectable } from '@nestjs/common';
import { FileInputStreamDto } from '../dto/file-input.dto';
import { File } from '../domain/file.entity';
import { ICreateFileApplication } from '../interfaces/applications/create.file.application.interface';
import { IStoreFileService } from '../interfaces/services/store.file.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class CreateFileApplication implements ICreateFileApplication {
  constructor(
    @Inject(TYPES.services.IStoreFileService)
    private readonly storeFileService: IStoreFileService,
  ) {}

  async execute({
    bucket,
    fileName,
    stream,
  }: FileInputStreamDto): Promise<File> {
    return this.storeFileService.execute({
      bucket,
      fileName,
      stream,
    });
  }
}
