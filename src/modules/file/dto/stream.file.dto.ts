import { ReadStream } from 'fs';

export class StreamFileDto {
  stream: ReadStream;

  response: {
    'Content-Length'?: number;
    'Content-Range'?: string;
    'Accept-Ranges'?: string;
  };
}
