import { ThumbnailOptions } from 'modules/file/domain';
import { ReadStream } from 'fs';

export interface IGetThumbnailByIdFileApplication {
  execute(
    fileId: string,
    thumbnailOptions?: ThumbnailOptions,
  ): Promise<ReadStream>;
}
