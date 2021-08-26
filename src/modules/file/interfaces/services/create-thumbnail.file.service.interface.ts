import { ReadStream } from 'fs';
import { ThumbnailOptions, FileType } from 'modules/file/domain';

export interface ICreateThumbnailFileService {
  execute(
    type: FileType,
    fileStream: ReadStream,
    thumbnailOptions: ThumbnailOptions,
  ): Promise<ReadStream>;
}
