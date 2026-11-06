export interface ICheckNameProjectService {
  execute(name: string, excludeId?: string): Promise<boolean>;
}
