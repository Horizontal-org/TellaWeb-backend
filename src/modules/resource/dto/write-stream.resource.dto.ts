import { Stream } from 'stream';


export class WriteStreamResourceDto {
  fileName: string;

  bucket: string;

  stream: Stream;
}
