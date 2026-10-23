import { PayloadTooLargeException } from '@nestjs/common';
import { ReadStream } from 'fs';

// Without maxBytes the whole stream is buffered, whatever its size
export const streamToBuffer = (
  stream: ReadStream,
  maxBytes?: number,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    let data = [];
    let total = 0;
    let settled = false;

    stream.on('data', (chunk) => {
      if (settled) return;

      total += chunk.length;
      if (maxBytes !== undefined && total > maxBytes) {
        // The request isn't destroyed so the 413 can still be sent; the rest
        // of the body is read and discarded
        settled = true;
        data = [];
        reject(new PayloadTooLargeException('File is too large'));
        return;
      }

      data.push(chunk);
    });

    stream.on('end', () => {
      if (settled) return;
      settled = true;
      resolve(Buffer.concat(data));
    });

    stream.on('error', (err) => {
      if (settled) return;
      settled = true;
      reject(err);
    });
  });
};
