import { PayloadTooLargeException } from '@nestjs/common';
import { ReadStream } from 'fs';
import { Readable } from 'stream';

import { streamToBuffer } from './streamToBuffer';

const MB = 1024 * 1024;

const streamOf = (size: number, chunkSize = MB): ReadStream => {
  const chunks = [];
  for (let sent = 0; sent < size; sent += chunkSize) {
    chunks.push(Buffer.alloc(Math.min(chunkSize, size - sent), 1));
  }
  return Readable.from(chunks) as unknown as ReadStream;
};

describe('streamToBuffer', () => {
  it('should buffer streams of any size when no limit is given', async () => {
    const buffer = await streamToBuffer(streamOf(25 * MB));

    expect(buffer.length).toBe(25 * MB);
  });

  it('should buffer a stream up to the limit', async () => {
    const buffer = await streamToBuffer(streamOf(20 * MB), 20 * MB);

    expect(buffer.length).toBe(20 * MB);
  });

  it('should reject a stream over the limit', async () => {
    await expect(
      streamToBuffer(streamOf(20 * MB + 1), 20 * MB),
    ).rejects.toThrow(PayloadTooLargeException);
  });

  it('should reject when the stream errors', async () => {
    const stream = new Readable({
      read() {
        this.destroy(new Error('boom'));
      },
    }) as unknown as ReadStream;

    await expect(streamToBuffer(stream)).rejects.toThrow('boom');
  });
});
