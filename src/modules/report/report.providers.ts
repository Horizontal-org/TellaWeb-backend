import { TYPES } from './interfaces/types';
import { CreateReportApplication } from './applications/create.report.application';
import { GetByIdReportApplication } from './applications/get-by-id.report.application';
import { CreateReportService } from './services/create.report.service';
import { GetByIdReportService } from './services/get-by-id.report.service';
import { ListReportService } from './services/list.report.service';
import { ListReportApplication } from './applications/list.report.application';
import { DeleteByIdReportService } from './services/delete-by-id.report.service';
import { DeleteByIdReportApplication } from './applications/delete-by-id.report.application';
import { BatchDeleteReportService } from './services/batch-delete.report.service';
import { BatchDeleteReportApplication } from './applications/batch-delete.report.application';

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

export const deleteByIdReportApplicationProvider = {
  provide: TYPES.applications.IDeleteByIdReportApplication,
  useClass: DeleteByIdReportApplication,
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

export const deleteByIdReportServiceProvider = {
  provide: TYPES.services.IDeleteByIdReportService,
  useClass: DeleteByIdReportService,
};

export const batchDeleteReportServiceProvider = {
  provide: TYPES.services.IBatchDeleteReportService,
  useClass: BatchDeleteReportService,
};

export const batchDeleteReportApplicationProvider = {
  provide: TYPES.applications.IBatchDeleteReportApplication,
  useClass: BatchDeleteReportApplication,
};

export const applicationsReportProviders = [
  createReportApplicationProvider,
  getByIdReportApplicationProvider,
  listReportApplicationProvider,
  deleteByIdReportApplicationProvider,
  batchDeleteReportApplicationProvider,
];

export const servicesReportProviders = [
  createReportServiceProvider,
  getByIdServiceProvider,
  listReportServiceProvider,
  deleteByIdReportServiceProvider,
  batchDeleteReportServiceProvider,
];
