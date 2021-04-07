import { Stream } from 'stream';

import { ReadFileDto } from './read.file.dto';

export class WriteStreamFileDto extends ReadFileDto {
  stream: Stream;
}
