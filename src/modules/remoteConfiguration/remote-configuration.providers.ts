import { TYPES } from './interfaces';
import { GetByShortCodeRemoteConfigurationApplication } from './application';
import { GetByShortCodeRemoteConfigurationService } from './services';
import { ListRemoteConfigurationApplication } from './application/list.remote-configuration.application';
import { ListRemoteConfigurationService } from './services/list.remote-configuration.service';
import { DeleteByIdRemoteConfigurationService } from './services/delete-by-id.remote-configuration.service';
import { DeleteByIdRemoteConfigurationApplication } from './application/delete-by-id.remote-configuration.application';

export const getByShortCodeRemoteConfigurationApplicationProvider = {
  provide: TYPES.applications.IGetByShortCodeRemoteConfigurationApplication,
  useClass: GetByShortCodeRemoteConfigurationApplication,
};

export const listRemoteConfigurationApplicationProvider = {
  provide: TYPES.applications.IListRemoteConfigurationApplication,
  useClass: ListRemoteConfigurationApplication,
};

export const deleteByIdRemoteConfigurationApplicationProvider = {
  provide: TYPES.applications.IDeleteByIdRemoteConfigurationApplication,
  useClass: DeleteByIdRemoteConfigurationApplication,
};

export const getByShortCodeRemoteConfigurationServiceProvider = {
  provide: TYPES.services.IGetByShortCodeRemoteConfigurationService,
  useClass: GetByShortCodeRemoteConfigurationService,
};

export const listRemoteConfigurationServiceProvider = {
  provide: TYPES.services.IListRemoteConfigurationService,
  useClass: ListRemoteConfigurationService,
};

export const deleteByIdRemoteConfigurationServiceProvider = {
  provide: TYPES.services.IDeleteByIdRemoteConfigurationService,
  useClass: DeleteByIdRemoteConfigurationService,
};

export const applicationsRemoteConfigurationProviders = [
  getByShortCodeRemoteConfigurationApplicationProvider,
  listRemoteConfigurationApplicationProvider,
  deleteByIdRemoteConfigurationApplicationProvider,
];

export const servicesRemoteConfigurationProviders = [
  getByShortCodeRemoteConfigurationServiceProvider,
  listRemoteConfigurationServiceProvider,
  deleteByIdRemoteConfigurationServiceProvider,
];
