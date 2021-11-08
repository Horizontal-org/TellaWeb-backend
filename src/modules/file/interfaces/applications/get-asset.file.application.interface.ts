import { ReadStream } from 'fs';

export interface IGetAssetFileApplication {
  execute(fileId: string): Promise<ReadStream>;
}
