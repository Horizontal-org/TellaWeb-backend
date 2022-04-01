import { StreamFileDto } from 'modules/file/dto/stream.file.dto';

export interface IGetAssetFileApplication {
  execute(fileId: string, range?: string): Promise<StreamFileDto>;
}
