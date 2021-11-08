import { Inject, Injectable } from '@nestjs/common';

import { ReadFileDto } from '../dto';
import {
  IDeleteThumbnailFileService,
  IThumbnailFileHandler,
  TYPES,
} from '../interfaces';

@Injectable()
export class DeleteThumbnailFileService implements IDeleteThumbnailFileService {
  constructor(
    @Inject(TYPES.handlers.IThumbnailFileHandler)
    private readonly thumbnailFileHandler: IThumbnailFileHandler,
  ) {}

  async execute({ bucket, fileName }: ReadFileDto): Promise<boolean> {
    const deleted = await this.thumbnailFileHandler.delete({
      bucket,
      fileName,
    });
    return deleted;
  }
}
