import { RemoteConfigurationEntity } from 'modules/remoteConfiguration/domain';
import { EditRemoteConfigurationDto } from '../../dto';

export interface IEditRemoteConfigurationService {
  execute(
    editRemoteConfigurationDto: EditRemoteConfigurationDto,
  ): Promise<RemoteConfigurationEntity>;
}
