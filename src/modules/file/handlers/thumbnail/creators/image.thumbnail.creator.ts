import { Injectable } from '@nestjs/common';
import { ReadStream, createReadStream } from 'fs';
import * as ImageThumbnail from 'image-thumbnail';

import { ThumbnailOptions, FileType } from 'modules/file/domain';
import { ICreatorThumbnailFileHandler } from '../../../interfaces';

@Injectable()
export class ImageThumbnailCreator implements ICreatorThumbnailFileHandler {
  public type = FileType.IMAGE;

  public async execute(
    fileStream: ReadStream,
    { width }: ThumbnailOptions = { width: 200 },
  ): Promise<ReadStream> {
    const thumbnailBuffer = await ImageThumbnail(fileStream, {
      width,
      responseType: 'buffer',
    });

    return createReadStream(thumbnailBuffer);
  }
}
