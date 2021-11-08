import { Injectable } from '@nestjs/common';
import * as JSZip from 'jszip';
import { ReadStream } from 'fs';
import { basename } from 'path';

import { ICompressionFileHandler } from '../../interfaces';
import { bufferToStream } from '../utils/bufferToStream';

@Injectable()
export class CompressionFileHandler implements ICompressionFileHandler {
  async execute(filesStream: ReadStream[]): Promise<ReadStream> {
    const zip = new JSZip();

    filesStream.map((file) => zip.file(basename(file.path.toString()), file));

    const zipContent = await zip.generateAsync({
      type: 'nodebuffer',
      streamFiles: true,
    });

    return bufferToStream(zipContent);
  }
}
