import {
  CreateRemoteConfigurationDto,
  ReadRemoteConfigurationDto,
} from '../../dto';

export interface IEditRemoteConfigurationService {
  execute(
    editRemoteConfigurationDto: CreateRemoteConfigurationDto,
  ): Promise<ReadRemoteConfigurationDto>;
}
