import { RemoteConfigurationEntity } from '../../domain';
import { CreateRemoteConfigurationDto } from '../../dto';

export interface ICreateRemoteConfigurationService {
  execute(
    createConfigurationDto: CreateRemoteConfigurationDto,
  ): Promise<RemoteConfigurationEntity>;
}
