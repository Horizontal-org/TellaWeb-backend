import { TYPES } from './interfaces';

import { CreateProjectApplication } from './applications/create.project.application';
import { CreateProjectService } from './services/create.project.service';

import { ListProjectApplication } from './applications/list.project.application';
import { ListProjectService } from './services/list.project.service';

import { GetByIdProjectApplication } from './applications/get-by-id.project.application';
import { GetByIdProjectService } from './services/get-by-id.project.service';

import { EditProjectApplication } from './applications/edit.project.application';
import { EditProjectService } from './services/edit.project.service';

import { DeleteByIdProjectApplication } from './applications/delete-by-id.project.application';
import { DeleteByIdProjectService } from './services/delete-by-id.project.service';

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

export const editProjectApplicationProvider = { 
  provide: TYPES.applications.IEditProjectApplication,
  useClass: EditProjectApplication,
};

export const editProjectServiceProvider = {
  provide: TYPES.services.IEditProjectService,
  useClass: EditProjectService,
};

export const deleteByIdProjectApplicationProvider = {
  provide: TYPES.applications.IDeleteByIdProjectApplication,
  useClass: DeleteByIdProjectApplication
};

export const deleteByIdProjectServiceProvider = {
  provide: TYPES.services.IDeleteByIdProjectService,
  useClass: DeleteByIdProjectService,
};

export const applicationsProjectProviders = [
  createProjectApplicationProvider,
  listProjectApplicationProvider,
  getByIdProjectApplicationProvider,
  editProjectApplicationProvider,
  deleteByIdProjectApplicationProvider
];

export const servicesProjectProviders = [
  createProjectServiceProvider,
  listProjectServiceProvider,
  getByIdProjectServiceProvider,
  editProjectServiceProvider,
  deleteByIdProjectServiceProvider
];
