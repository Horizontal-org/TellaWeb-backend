import { ReadStream } from 'fs';

export interface ICompressionFileHandler {
  execute(filesStream: ReadStream[]): Promise<ReadStream>;
}
