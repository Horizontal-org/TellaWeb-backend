import { Stream } from 'stream';

export type FileInputDto = {
  bucket: string;
  fileName: string;
};

export type FileInputStreamDto = FileInputDto & {
  stream: Stream;
};
