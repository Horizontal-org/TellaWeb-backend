import { Injectable } from '@nestjs/common';
import { ReadStream } from 'fs';
import { Readable } from 'stream';

import { sharp } from 'common/utils/sharp.utils';
import { ThumbnailOptions, FileType } from 'modules/file/domain';
import { ICreatorThumbnailFileHandler } from '../../../interfaces';
import { streamToBuffer } from '../../utils/streamToBuffer';

@Injectable()
export class ImageThumbnailCreator implements ICreatorThumbnailFileHandler {
  public type = FileType.IMAGE;

  // What the image-thumbnail package did, with sharp directly: scale to the
  // width keeping the aspect ratio, transparent areas on white, and the
  // source's format kept. Never larger than the source: with only a width,
  // fit 'contain' (what image-thumbnail used) ignores withoutEnlargement, so
  // asking for 5000 pixels produced a 5000-pixel image; 'inside' doesn't.
  public async execute(
    fileStream: ReadStream,
    { width }: ThumbnailOptions = { width: 200 },
  ): Promise<Readable> {
    const image = await streamToBuffer(fileStream);
    const thumbnailBuffer = await sharp(image)
      .resize({ width, withoutEnlargement: true, fit: 'inside' })
      .flatten({ background: '#ffffff' })
      .jpeg({ force: false })
      .toBuffer();
    return Readable.from(thumbnailBuffer);
  }
}
