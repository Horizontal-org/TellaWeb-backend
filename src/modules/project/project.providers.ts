import { TYPES } from './interfaces';

import { CreateProjectApplication } from './applications/create.project.application';
import { CreateProjectService } from './services/create.project.service';

import { ListProjectApplication } from './applications/list.project.application';
import { ListProjectService } from './services/list.project.service';

import { GetByIdProjectApplication } from './applications/get-by-id.project.application';
import { GetByIdProjectService } from './services/get-by-id.project.service';

export const createProjectApplicationProvider = {
  provide: TYPES.applications.ICreateProjectApplication,
  useClass: CreateProjectApplication,
};

export const createProjectServiceProvider = {
  provide: TYPES.services.ICreateProjectService,
  useClass: CreateProjectService,
};

export const listProjectApplicationProvider = {
  provide: TYPES.applications.IListProjectApplication,
  useClass: ListProjectApplication,
};

export const listProjectServiceProvider = {
  provide: TYPES.services.IListProjectService,
  useClass: ListProjectService,
};

export const getByIdProjectApplicationProvider = {
  provide: TYPES.applications.IGetByIdProjectApplication,
  useClass: GetByIdProjectApplication,
};

export const getByIdProjectServiceProvider = {
  provide: TYPES.services.IGetByIdProjectService,
  useClass: GetByIdProjectService,
};

export const applicationsProjectProviders = [
  createProjectApplicationProvider,
  listProjectApplicationProvider,
  getByIdProjectApplicationProvider
];

export const servicesProjectProviders = [
  createProjectServiceProvider,
  listProjectServiceProvider,
  getByIdProjectServiceProvider
];
