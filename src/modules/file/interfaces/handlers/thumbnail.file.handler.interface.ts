import { ReadStream } from 'fs';
import { ReadFileDto } from '../../dto';
import { ThumbnailOptions, FileType } from '../../domain';
import { Readable } from 'stream';

export interface ICreatorThumbnailFileHandler {
  type: FileType;
  execute(fileStream, options: ThumbnailOptions): Promise<Readable>;
}

export interface IThumbnailFileHandler {
  create(
    type: FileType,
    fileStream: ReadStream,
    options: ThumbnailOptions,
  ): Promise<Readable>;

  delete(readFileDto: ReadFileDto): Promise<boolean>;
}
