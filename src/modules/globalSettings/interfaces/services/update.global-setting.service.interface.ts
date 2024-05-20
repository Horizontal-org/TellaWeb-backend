
export interface IUpdateGlobalSettingService {
  execute(name: string, value: string): Promise<boolean>;
}
