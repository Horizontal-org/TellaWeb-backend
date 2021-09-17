import { TYPES } from './interfaces';
import { GetByShortCodeRemoteConfigurationApplication } from './application';
import { GetByShortCodeRemoteConfigurationService } from './services';

export const getByShortCodeRemoteConfigurationApplicationProvider = {
  provide: TYPES.applications.IGetByShortCodeRemoteConfigurationApplication,
  useClass: GetByShortCodeRemoteConfigurationApplication,
};

export const getByShortCodeRemoteConfigurationServiceProvider = {
  provide: TYPES.services.IGetByShortCodeRemoteConfigurationService,
  useClass: GetByShortCodeRemoteConfigurationService,
};

export const applicationsRemoteConfigurationProviders = [
  getByShortCodeRemoteConfigurationApplicationProvider,
];

export const servicesRemoteConfigurationProviders = [
  getByShortCodeRemoteConfigurationServiceProvider,
];
