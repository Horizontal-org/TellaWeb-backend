import { ReadStream } from 'fs';
import { Readable } from 'stream';

export const bufferToStream = (buffer: Buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  return stream as ReadStream;
};
