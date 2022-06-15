import { TYPES } from './interfaces';
import { GetByShortCodeRemoteConfigurationApplication } from './application';
import { GetByShortCodeRemoteConfigurationService } from './services';
import { ListRemoteConfigurationApplication } from './application/list.remote-configuration.application';
import { ListRemoteConfigurationService } from './services/list.remote-configuration.service';
import { DeleteByIdRemoteConfigurationService } from './services/delete-by-id.remote-configuration.service';
import { DeleteByIdRemoteConfigurationApplication } from './application/delete-by-id.remote-configuration.application';
import { CreateRemoteConfigurationApplication } from './application/create.remote-configuration.application';
import { CreateRemoteConfigurationService } from './services/create.remote-configuration.service';
import { GetByIdRemoteConfigurationApplication } from './application/get-by-id.remote-configuration.application';
import { GetByIdRemoteConfigService } from './services/get-by-id.remote-configuration.service';
import { EditRemoteConfigurationApplication } from './application/edit.remote-configuration.application';
import { EditRemoteConfigurationService } from './services/edit.remote-configuration.service';

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

export const createRemoteConfigurationApplicationProvider = {
  provide: TYPES.applications.ICreateRemoteConfigurationApplication,
  useClass: CreateRemoteConfigurationApplication,
};

export const getByIdRemoteConfigurationApplicationProvider = {
  provide: TYPES.applications.IGetByIdRemoteConfigurationApplication,
  useClass: GetByIdRemoteConfigurationApplication,
};

export const editRemoteConfigurationApplicationProvider = {
  provide: TYPES.applications.IEditRemoteConfigurationApplication,
  useClass: EditRemoteConfigurationApplication
}

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

export const createRemoteConfigurationServiceProvider = {
  provide: TYPES.services.ICreateRemoteConfigurationService,
  useClass: CreateRemoteConfigurationService,
};

export const getByIdRemoteConfigurationServiceProvider = {
  provide: TYPES.services.IGetByIdRemoteConfigurationService,
  useClass: GetByIdRemoteConfigService,
};

export const editRemoteConfigurationServiceProvider = {
  provide: TYPES.services.IEditRemoteConfigurationService,
  useClass: EditRemoteConfigurationService
}

export const applicationsRemoteConfigurationProviders = [
  getByShortCodeRemoteConfigurationApplicationProvider,
  listRemoteConfigurationApplicationProvider,
  deleteByIdRemoteConfigurationApplicationProvider,
  createRemoteConfigurationApplicationProvider,
  getByIdRemoteConfigurationApplicationProvider,
  editRemoteConfigurationApplicationProvider
];

export const servicesRemoteConfigurationProviders = [
  getByShortCodeRemoteConfigurationServiceProvider,
  listRemoteConfigurationServiceProvider,
  deleteByIdRemoteConfigurationServiceProvider,
  createRemoteConfigurationServiceProvider,
  getByIdRemoteConfigurationServiceProvider,
  editRemoteConfigurationServiceProvider
];
