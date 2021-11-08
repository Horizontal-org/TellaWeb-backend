export interface IDeleteByIdRemoteConfigurationApplication {
  execute(configurationId: string): Promise<boolean>;
}
