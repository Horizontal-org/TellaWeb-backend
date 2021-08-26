import { ReadStream } from 'fs';
import { ThumbnailOptions, FileType } from '../../domain';

export interface ICreatorThumbnailFileHandler {
  type: FileType;
  execute(fileStream, options: ThumbnailOptions): Promise<ReadStream>;
}

export interface IThumbnailFileHandler {
  create(
    type: FileType,
    fileStream: ReadStream,
    options: ThumbnailOptions,
  ): Promise<ReadStream>;
}
