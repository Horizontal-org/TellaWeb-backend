import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { createReadStream, ReadStream } from 'fs';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';

import { FileType, ThumbnailOptions } from 'modules/file/domain';
import { ICreatorThumbnailFileHandler } from '../../../interfaces';

@Injectable()
export class VideoThumbnailCreator implements ICreatorThumbnailFileHandler {
  public type = FileType.VIDEO;

  public execute(
    fileStream: ReadStream,
    { width }: ThumbnailOptions = { width: 200 },
  ): Promise<ReadStream> {
    return new Promise((res) => {
      const filename = `thumbnail-${uuid()}.png`;
      const folder = '/tmp';

      ffmpeg()
        .input(fileStream.path.toString())
        .screenshots({
          count: 1,
          timemarks: ['1'],
          size: `${width}x?`,
          folder,
          filename: filename,
        })
        .on('end', async () => {
          const tempFileStream = createReadStream(path.join(folder, filename));
          res(tempFileStream);
        });
    });
  }
}
