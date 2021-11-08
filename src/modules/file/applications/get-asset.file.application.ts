import { Inject, Injectable } from '@nestjs/common';
import { ReadStream } from 'fs';
import {
  IFetchFileService,
  IGetAssetFileApplication,
  IGetByIdFileApplication,
  TYPES,
} from '../interfaces';

@Injectable()
export class GetAssetFileApplication implements IGetAssetFileApplication {
  constructor(
    @Inject(TYPES.applications.IGetByIdFileApplication)
    private readonly getByIdFileApplication: IGetByIdFileApplication,
    @Inject(TYPES.services.IFetchFileService)
    private readonly fetchFileService: IFetchFileService,
  ) {}

  async execute(fileId: string): Promise<ReadStream> {
    const file = await this.getByIdFileApplication.execute(fileId);
    const stream = await this.fetchFileService.execute(file);

    return stream;
  }
}
