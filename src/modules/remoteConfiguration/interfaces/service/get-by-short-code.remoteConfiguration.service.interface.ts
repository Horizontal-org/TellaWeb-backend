import { RemoteConfigurationEntity } from 'modules/remoteConfiguration/domain';

export interface IGetByShortCodeRemoteConfigurationService {
  execute(shortCode: string): Promise<RemoteConfigurationEntity>;
}
