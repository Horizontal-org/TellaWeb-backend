import { ReadRemoteConfigurationDto } from '../../dto/read.remote-configuration.dto';

export interface IGetByIdRemoteConfigurationApplication {
  execute(id: string): Promise<ReadRemoteConfigurationDto>;
}
