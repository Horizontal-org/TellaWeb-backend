export interface IDeleteFileService {
  execute(fileId: string): Promise<boolean>;
}
