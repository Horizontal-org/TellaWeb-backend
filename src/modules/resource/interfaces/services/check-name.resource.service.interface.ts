
export interface ICheckNameResourceService {
  execute(name: string): Promise<boolean>;
}
