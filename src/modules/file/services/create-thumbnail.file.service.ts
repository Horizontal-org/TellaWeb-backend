import { Inject, Injectable } from '@nestjs/common';
import { ReadStream } from 'fs';
import { FileType } from '../domain/file-type.file.enum';
import { ThumbnailOptions } from '../domain/thumbnail-options.file.vo';
import {
  ICreateThumbnailFileService,
  IThumbnailFileHandler,
  TYPES,
} from '../interfaces';

@Injectable()
export class CreateThumbnailFileService implements ICreateThumbnailFileService {
  constructor(
    @Inject(TYPES.handlers.IThumbnailFileHandler)
    private thumbnailFileHandler: IThumbnailFileHandler,
  ) {}
  async execute(
    type: FileType,
    fileStream: ReadStream,
    { width }: ThumbnailOptions = { width: 200 },
  ): Promise<ReadStream> {
    return this.thumbnailFileHandler.create(type, fileStream, {
      width,
    });
  }
}
