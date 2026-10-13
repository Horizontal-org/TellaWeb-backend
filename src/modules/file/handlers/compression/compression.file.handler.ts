import { Injectable } from '@nestjs/common';
import * as archiver from 'archiver';
import { ReadStream } from 'fs';
import { basename } from 'path';
import { Readable } from 'stream';

import { ICompressionFileHandler } from '../../interfaces';

@Injectable()
export class CompressionFileHandler implements ICompressionFileHandler {
  // The zip is built while it's read, so only a small window of it is ever in
  // memory, and the first bytes go out right away. The caller must listen for
  // 'error' on the returned stream.
  async execute(filesStream: ReadStream[]): Promise<Readable> {
    // most of the content is media that is already compressed, so a high
    // level only burns CPU for almost no gain (same as the backup zip)
    const archive = archiver('zip', { zlib: { level: 1 } });

    filesStream.forEach((file) =>
      archive.append(file, { name: basename(file.path.toString()) }),
    );
    // not awaited: it resolves once the whole zip has been read, which only
    // happens after the caller pipes it somewhere
    archive.finalize().catch(() => {
      // reported through the archive's 'error' event
    });

    return archive;
  }
}
