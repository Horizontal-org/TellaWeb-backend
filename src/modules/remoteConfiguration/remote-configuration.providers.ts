import { TYPES } from './interfaces';
import { GetByShortCodeRemoteConfigurationApplication } from './application';
import { GetByShortCodeRemoteConfigurationService } from './services';
import { ListRemoteConfigurationApplication } from './application/list.remote-configuration.application';
import { ListRemoteConfigurationService } from './services/list.remote-configuration.service';

export const getByShortCodeRemoteConfigurationApplicationProvider = {
  provide: TYPES.applications.IGetByShortCodeRemoteConfigurationApplication,
  useClass: GetByShortCodeRemoteConfigurationApplication,
};

export const listRemoteConfiguratioApplicationProvider = {
  provide: TYPES.applications.IListRemoteConfigurationApplication,
  useClass: ListRemoteConfigurationApplication,
};

export const getByShortCodeRemoteConfigurationServiceProvider = {
  provide: TYPES.services.IGetByShortCodeRemoteConfigurationService,
  useClass: GetByShortCodeRemoteConfigurationService,
};

export const listRemoteConfigurationServiceProvider = {
  provide: TYPES.services.IListRemoteConfigurationService,
  useClass: ListRemoteConfigurationService,
};

export const applicationsRemoteConfigurationProviders = [
  getByShortCodeRemoteConfigurationApplicationProvider,
  listRemoteConfiguratioApplicationProvider,
];

export const servicesRemoteConfigurationProviders = [
  getByShortCodeRemoteConfigurationServiceProvider,
  listRemoteConfigurationServiceProvider,
];
