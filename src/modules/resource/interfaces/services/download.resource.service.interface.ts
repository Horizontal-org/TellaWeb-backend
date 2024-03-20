import { ReadStream } from 'fs';

export interface IDownloadResourceService {
  execute(fileNames: string[]): Promise<ReadStream>;  
}
