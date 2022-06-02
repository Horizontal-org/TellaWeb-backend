import { RemoteConfigurationEntity } from 'modules/remoteConfiguration/domain';

export interface IGetByIdRemoteConfigurationService {
  execute(reportId: string): Promise<RemoteConfigurationEntity>;
}
