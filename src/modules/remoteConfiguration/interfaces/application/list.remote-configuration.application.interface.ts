import { RemoteConfigurationReadDto } from '../../dto';

export interface IListRemoteConfigurationApplication {
  execute(): Promise<RemoteConfigurationReadDto[]>;
}
