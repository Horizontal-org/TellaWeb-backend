import {
  EditRemoteConfigurationDto,
  ReadRemoteConfigurationDto,
} from '../../dto';

export interface IEditRemoteConfigurationApplication {
  execute(
    editRemoteConfigurationDto: EditRemoteConfigurationDto,
  ): Promise<ReadRemoteConfigurationDto>;
}
