import { createWriteStream } from 'fs';
import { Stream } from 'stream';
import fs from 'fs'

export const createWritePromise = (filePath: string, stream: Stream) =>
  new Promise<boolean>((res, rej) => {
    const startTime = Date.now();
    let written = 0;
    let chunkCount = 0;

    console.log(`[STREAM] Starting stream write to: ${filePath}`);

    stream
      .on('data', (c) => {
        chunkCount++;
        written += c.length;
        console.log(`[STREAM] Chunk #${chunkCount}: ${c.length} bytes (total: ${written} bytes)`);
      })
      .on('end', () => {
        console.log(`[STREAM] Stream ended - received ${chunkCount} chunks, ${written} bytes total`);
      })
      .pipe(createWriteStream(filePath, { flags: 'a', mode: 0o644 }))
      .on('pipe', () => {
        console.log(`[STREAM] Pipe connected to file`);
      })
      .on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(`[STREAM] Write finished in ${duration}ms - ${written} bytes written in ${chunkCount} chunks`);
        res(true);
      })
      .on('error', (error: Error) => {
        console.log(`[STREAM] ERROR:`, error);
        rej(error);
      });
  });
