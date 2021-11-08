export interface IDeleteFileApplication {
  execute(fileId: string): Promise<boolean>;
}
