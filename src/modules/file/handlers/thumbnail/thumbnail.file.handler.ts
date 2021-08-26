import { Inject, Injectable } from '@nestjs/common';
import { ReadStream } from 'fs';

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
  ): Promise<ReadStream> {
    const thumbnailCreatorForTheType = this.thumbnailCreators.find(
      (thumbnailCreator) => thumbnailCreator.type === type,
    );

    if (!thumbnailCreatorForTheType) throw new ThumbnailCreatorNotFound(type);

    return thumbnailCreatorForTheType.execute(fileStream, options);
  }
}
