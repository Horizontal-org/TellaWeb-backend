import { ReadStream } from 'fs';
import { ThumbnailOptions, FileType } from 'modules/file/domain';
import { Readable } from 'stream';

export interface ICreateThumbnailFileService {
  execute(
    type: FileType,
    fileStream: ReadStream,
    thumbnailOptions: ThumbnailOptions,
  ): Promise<Readable>;
}
