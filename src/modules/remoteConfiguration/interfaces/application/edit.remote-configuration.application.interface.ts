import {
  CreateRemoteConfigurationDto,
  ReadRemoteConfigurationDto,
} from '../../dto';

export interface IEditRemoteConfigurationApplication {
  execute(
    editRemoteConfigurationDto: CreateRemoteConfigurationDto,
  ): Promise<ReadRemoteConfigurationDto>;
}
