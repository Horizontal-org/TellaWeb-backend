import { UnsupportedMediaTypeException } from '@nestjs/common';
import { FileType } from '../domain';

export class ThumbnailCreatorNotFound extends UnsupportedMediaTypeException {
  constructor(fileType: FileType) {
    const message = `File type ${fileType} thumbnail creator not found.`;
    super(message);
  }
}
