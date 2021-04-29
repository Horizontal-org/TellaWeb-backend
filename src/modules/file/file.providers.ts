import { TYPES } from './interfaces/types';
import { CloseFileApplication } from './applications/close.file.application';
import { CreateFileApplication } from './applications/create.file.application';
import { GetByNameAndBucketFileApplication } from './applications/get-by-bucket-and-file-name.file.application';
import { GetByIdFileApplication } from './applications/get-by-id.file.application';
import { StorageFileHandler } from './handlers/storage.file.handler';
import { CloseFileService } from './services/close.file.service';
import { GetByIdFileService } from './services/get-by-id.file.service';
import { GetInfoFileService } from './services/get-info.file.application';
import { GetOrCreateFileService } from './services/get-or-create.file.service';
import { StoreFileService } from './services/store.file.service';
import { GetAssetFileApplication } from './applications/get-asset.file.application';
import { FetchFileService } from './services/fetch.file.service';

export const storageFileHandlerProvider = {
  provide: TYPES.handlers.IStorageFileHandler,
  useClass: StorageFileHandler,
};

export const getByNameAndBucketFileApplicationProvider = {
  provide: TYPES.applications.IGetByNameAndBucketFileApplication,
  useClass: GetByNameAndBucketFileApplication,
};

export const getByIdFileApplicationProvider = {
  provide: TYPES.applications.IGetByIdFileApplication,
  useClass: GetByIdFileApplication,
};

export const createFileApplicationProvider = {
  provide: TYPES.applications.ICreateFileApplication,
  useClass: CreateFileApplication,
};

export const closeFileApplicationProvider = {
  provide: TYPES.applications.ICloseFileApplication,
  useClass: CloseFileApplication,
};

export const getAssetFileApplicationProvider = {
  provide: TYPES.applications.IGetAssetFileApplication,
  useClass: GetAssetFileApplication,
};

export const getByIdFileServiceProvider = {
  provide: TYPES.services.IGetByIdFileService,
  useClass: GetByIdFileService,
};

export const getInfoFileServiceProvider = {
  provide: TYPES.services.IGetInfoFileService,
  useClass: GetInfoFileService,
};

export const getOrCreateFileServiceProvider = {
  provide: TYPES.services.IGetOrCreateFileService,
  useClass: GetOrCreateFileService,
};

export const storeFileSericeProvider = {
  provide: TYPES.services.IStoreFileService,
  useClass: StoreFileService,
};

export const closeFileServiceProvider = {
  provide: TYPES.services.ICloseFileService,
  useClass: CloseFileService,
};

export const fetchFileServiceProvider = {
  provide: TYPES.services.IFetchFileService,
  useClass: FetchFileService,
};

export const handlersFileProviders = [storageFileHandlerProvider];

export const applicationsFileProviders = [
  getByNameAndBucketFileApplicationProvider,
  getByIdFileApplicationProvider,
  createFileApplicationProvider,
  closeFileApplicationProvider,
  getAssetFileApplicationProvider,
];

export const servicesFileProviders = [
  getByIdFileServiceProvider,
  getInfoFileServiceProvider,
  getOrCreateFileServiceProvider,
  storeFileSericeProvider,
  closeFileServiceProvider,
  fetchFileServiceProvider,
];
