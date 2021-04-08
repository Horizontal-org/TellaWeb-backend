import { TYPES } from './interfaces/types';
import { CreateReportApplication } from './applications/create.report.application';
import { GetByIdReportApplication } from './applications/get-by-id.report.application';
import { CreateReportService } from './services/create.report.service';
import { GetByIdReportService } from './services/get-by-id.report.service';
import { ListReportService } from './services/list.report.service';
import { ListReportApplication } from './applications/list.report.application';

export const createReportApplicationProvider = {
  provide: TYPES.applications.ICreateReportApplication,
  useClass: CreateReportApplication,
};
export const getByIdReportApplicationProvider = {
  provide: TYPES.applications.IGetByIdReportApplication,
  useClass: GetByIdReportApplication,
};

export const listReportApplicationProvider = {
  provide: TYPES.applications.IListReportApplication,
  useClass: ListReportApplication,
};

export const createReportServiceProvider = {
  provide: TYPES.services.ICreateReportService,
  useClass: CreateReportService,
};

export const getByIdServiceProvider = {
  provide: TYPES.services.IGetByIdReportService,
  useClass: GetByIdReportService,
};

export const listReportServiceProvider = {
  provide: TYPES.services.IListReportService,
  useClass: ListReportService,
};

export const applicationsReportProviders = [
  createReportApplicationProvider,
  getByIdReportApplicationProvider,
  listReportApplicationProvider,
];

export const servicesReportProviders = [
  createReportServiceProvider,
  getByIdServiceProvider,
  listReportServiceProvider,
];
