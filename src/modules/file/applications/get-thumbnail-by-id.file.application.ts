import { Inject, Injectable } from '@nestjs/common';
import { Readable } from 'stream';

import { ThumbnailOptions } from '../domain';
import {
  IFetchFileService,
  IGetThumbnailByIdFileApplication,
  IGetByIdFileApplication,
  TYPES,
  ICreateThumbnailFileService,
} from '../interfaces';

@Injectable()
export class GetThumbnailByIdFileApplication
  implements IGetThumbnailByIdFileApplication {
  constructor(
    @Inject(TYPES.applications.IGetByIdFileApplication)
    private readonly getByIdFileApplication: IGetByIdFileApplication,
    @Inject(TYPES.services.IFetchFileService)
    private readonly fetchFileService: IFetchFileService,
    @Inject(TYPES.services.ICreateThumbnailFileService)
    private readonly createThumbnailFileService: ICreateThumbnailFileService,
  ) {}

  async execute(
    fileId: string,
    { width }: ThumbnailOptions = {},
  ): Promise<Readable> {
    const file = await this.getByIdFileApplication.execute(fileId);
    const fileStream = await this.fetchFileService.execute(file);
    const thumbnailStream = await this.createThumbnailFileService.execute(
      file.type,
      fileStream,
      {
        width,
      },
    );

    return thumbnailStream;
  }
}
