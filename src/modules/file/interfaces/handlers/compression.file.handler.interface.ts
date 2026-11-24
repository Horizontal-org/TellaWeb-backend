import { ReadStream } from 'fs';
import { Readable } from 'stream';

export interface ICompressionFileHandler {
  execute(filesStream: ReadStream[]): Promise<Readable>;
}
