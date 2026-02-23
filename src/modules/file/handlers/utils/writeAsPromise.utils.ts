import { createWriteStream } from 'fs';
import { Stream } from 'stream';
import fs from 'fs'

export const createWritePromise = (filePath: string, stream: Stream) =>
  new Promise<number>((res, rej) => {
    const startTime = Date.now();
    let written = 0;

    console.log(`[STREAM] Starting stream write to: ${filePath}`);

    stream
      .on('data', (c) => {
        written += c.length;
      })
      .pipe(createWriteStream(filePath, { flags: 'a', mode: 0o644 }))
      .on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(`[STREAM] Write finished in ${duration}ms`);
        res(written);
      })
      .on('error', (error: Error) => {
        console.log(`[STREAM] ERROR:`, error);
        rej(error);
      });
  });
