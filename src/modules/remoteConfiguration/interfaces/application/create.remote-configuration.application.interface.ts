import {
  CreateRemoteConfigurationDto,
  ReadRemoteConfigurationDto,
} from '../../dto';

export interface ICreateRemoteConfigurationApplication {
  execute(
    createConfigurationDto: CreateRemoteConfigurationDto,
  ): Promise<ReadRemoteConfigurationDto>;
}
