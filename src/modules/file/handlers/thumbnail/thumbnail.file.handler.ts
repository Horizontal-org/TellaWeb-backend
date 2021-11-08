import { Inject, Injectable } from '@nestjs/common';
import { ReadStream } from 'fs';
import { Readable } from 'stream';

import { ThumbnailCreatorNotFound } from 'modules/file/exceptions';
import {
  ICreatorThumbnailFileHandler,
  IThumbnailFileHandler,
  TYPES,
} from 'modules/file/interfaces';
import { FileType, ThumbnailOptions } from '../../domain';

@Injectable()
export class ThumbnailFileHandler implements IThumbnailFileHandler {
  constructor(
    @Inject(TYPES.handlers.ICreatorThumbnailFileHandler)
    private thumbnailCreators: ICreatorThumbnailFileHandler[],
  ) {}

  public async create(
    type: FileType,
    fileStream: ReadStream,
    options: ThumbnailOptions,
  ): Promise<Readable> {
    /* TODO: Add get or create for cache */
    const thumbnailCreatorForTheType = this.thumbnailCreators.find(
      (thumbnailCreator) => thumbnailCreator.type === type,
    );
    if (!thumbnailCreatorForTheType) throw new ThumbnailCreatorNotFound(type);
    const result = await thumbnailCreatorForTheType.execute(
      fileStream,
      options,
    );
    return result;
  }

  public async delete(): Promise<boolean> {
    /* TODO: Delete saved cache */
    return true;
  }
}
