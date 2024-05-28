
export interface IUpdateGlobalSettingService {
  execute(id: string, enabled: boolean): Promise<void>;
}
