import { Injectable } from '@nestjs/common';
import { ReadStream } from 'fs';
import * as ImageThumbnail from 'image-thumbnail';

import { ThumbnailOptions, FileType } from 'modules/file/domain';
import { Readable } from 'stream';
import { ICreatorThumbnailFileHandler } from '../../../interfaces';

@Injectable()
export class ImageThumbnailCreator implements ICreatorThumbnailFileHandler {
  public type = FileType.IMAGE;

  public async execute(
    fileStream: ReadStream,
    { width }: ThumbnailOptions = { width: 200 },
  ): Promise<Readable> {
    const thumbnailBuffer = await ImageThumbnail(fileStream, {
      width,
      responseType: 'buffer',
    });
    return Readable.from(thumbnailBuffer);
  }
}
