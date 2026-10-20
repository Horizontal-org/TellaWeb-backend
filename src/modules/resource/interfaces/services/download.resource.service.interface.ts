import { Readable } from 'stream';

export interface IDownloadResourceService {
  execute(fileNames: string[]): Promise<Readable>;
}
