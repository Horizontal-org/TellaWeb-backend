export interface IDeleteResourceService {
  execute(fileId: string): Promise<boolean>;
}
