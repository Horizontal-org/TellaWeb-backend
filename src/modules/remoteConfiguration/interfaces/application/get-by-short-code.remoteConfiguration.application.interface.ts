import { RemoteConfigurationEntity } from 'modules/remoteConfiguration/domain';

export interface IGetByShortCodeRemoteConfigurationApplication {
  execute(shortCode: string): Promise<RemoteConfigurationEntity>;
}
