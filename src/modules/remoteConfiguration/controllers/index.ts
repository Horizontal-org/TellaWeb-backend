import { DeleteByIdRemoteConfigurationController } from './delete-by-id.remote-configuration.controller';
import { GetByShortCodeRemoteConfigurationController } from './get-by-short-code.remote-configuration.controller';
import { ListRemoteConfigurationController } from './list.remote-configuration.controller';

export const remoteConfigurationControllers = [
  GetByShortCodeRemoteConfigurationController,
  ListRemoteConfigurationController,
  DeleteByIdRemoteConfigurationController,
];
