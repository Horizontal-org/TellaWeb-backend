export interface IDeleteByIdRemoteConfigurationService {
  execute(configurationId: string): Promise<boolean>;
}
