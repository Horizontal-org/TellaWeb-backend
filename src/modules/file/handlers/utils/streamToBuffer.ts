import { ReadStream } from 'fs';

export const streamToBuffer = (stream: ReadStream): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const data = [];

    stream.on('data', (chunk) => {
      data.push(chunk);
    });

    stream.on('end', () => {
      resolve(Buffer.concat(data));
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
};
