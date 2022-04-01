import { ReadStream } from 'fs';

export class StreamFileDto {
  stream: ReadStream;

  response: Record<string, string | number>;
}
