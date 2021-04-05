import { TYPES } from './interfaces/types';
import { CreateReportApplication } from './applications/create.report.application';
import { GetByIdReportApplication } from './applications/get-by-id.report.application';
import { CreateReportService } from './services/create.report.service';
import { GetByIdReportService } from './services/get-by-id.report.service';

export const createReportApplicationProvider = {
  provide: TYPES.applications.ICreateReportApplication,
  useClass: CreateReportApplication,
};
export const getByIdReportApplicationProvider = {
  provide: TYPES.applications.IGetByIdReportApplication,
  useClass: GetByIdReportApplication,
};

export const createReportServiceProvider = {
  provide: TYPES.services.ICreateReportService,
  useClass: CreateReportService,
};
export const getByIdServiceProvider = {
  provide: TYPES.services.IGetByIdReportService,
  useClass: GetByIdReportService,
};
