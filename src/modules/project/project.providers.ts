import { TYPES } from './interfaces';

import { CreateProjectApplication } from './applications/create.project.application';
import { CreateProjectService } from './services/create.project.service';

export const createProjectApplicationProvider = {
  provide: TYPES.applications.ICreateProjectApplication,
  useClass: CreateProjectApplication,
};

export const createProjectServiceProvider = {
  provide: TYPES.services.ICreateProjectService,
  useClass: CreateProjectService,
};

export const applicationsProjectProviders = [
  createProjectApplicationProvider,
];

export const servicesProjectProviders = [
  createProjectServiceProvider,
];
