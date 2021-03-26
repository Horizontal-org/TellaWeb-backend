import { createWriteStream } from 'fs';
import { Stream } from 'stream';

export const createWritePromise = (filePath: string, stream: Stream) =>
  new Promise<boolean>((res, rej) => {
    stream
      .pipe(createWriteStream(filePath, { flags: 'a', mode: 0o644 }))
      .on('finish', () => res(true))
      .on('error', (error: Error) => rej(error));
  });
