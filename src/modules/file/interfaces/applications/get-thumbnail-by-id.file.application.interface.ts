import { ThumbnailOptions } from 'modules/file/domain';
import { Readable } from 'stream';

export interface IGetThumbnailByIdFileApplication {
  execute(
    fileId: string,
    thumbnailOptions?: ThumbnailOptions,
  ): Promise<Readable>;
}
