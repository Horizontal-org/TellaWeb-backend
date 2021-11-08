import { TYPES } from './interfaces/types';
import { CloseFileApplication } from './applications/close.file.application';
import { CreateFileApplication } from './applications/create.file.application';
import { GetByNameAndBucketFileApplication } from './applications/get-by-bucket-and-file-name.file.application';
import { GetByIdFileApplication } from './applications/get-by-id.file.application';
import { StorageFileHandler } from './handlers/storage/storage.file.handler';
import { CloseFileService } from './services/close.file.service';
import { GetByIdFileService } from './services/get-by-id.file.service';
import { GetInfoFileService } from './services/get-info.file.application';
import { GetOrCreateFileService } from './services/get-or-create.file.service';
import { StoreFileService } from './services/store.file.service';
import { GetAssetFileApplication } from './applications/get-asset.file.application';
import { FetchFileService } from './services/fetch.file.service';
import { GetThumbnailByIdFileApplication } from './applications/get-thumbnail-by-id.file.application';
import { CreateThumbnailFileService } from './services/create-thumbnail.file.service';
import { ImageThumbnailCreator } from './handlers/thumbnail/creators/image.thumbnail.creator';
import { VideoThumbnailCreator } from './handlers/thumbnail/creators/video.thumbnail.creator';
import { ThumbnailFileHandler } from './handlers/thumbnail/thumbnail.file.handler';
import { ZipBucketFileService } from './services/zip-bucket.file.service';
import { CompressionFileHandler } from './handlers/compression/compression.file.handler';
import { GetZippedBucketFileApplication } from './applications/get-zipped-bucket.file.application';
import { DeleteFileApplication } from './applications/delete.file.application';
import { DeleteFileService } from './services/delete.file.service';
import { DeleteFullFileService } from './services/delete-full.file.service';
import { DeleteThumbnailFileService } from './services/delete-thumbnail.file.service';
import { DeleteBucketFileService } from './services/delete-bucket.file.service';
import { DeleteBucketFileApplication } from './applications/delete-bucket.file.application';

export const storageFileHandlerProvider = {
  provide: TYPES.handlers.IStorageFileHandler,
  useClass: StorageFileHandler,
};

export const creatorsThumbnailFileHandlerProvider = {
  provide: TYPES.handlers.ICreatorThumbnailFileHandler,
  useValue: [new ImageThumbnailCreator(), new VideoThumbnailCreator()],
};

export const thumbnailFileHandlerProvider = {
  provide: TYPES.handlers.IThumbnailFileHandler,
  useClass: ThumbnailFileHandler,
};

export const compressionFileHandlerProvider = {
  provide: TYPES.handlers.ICompressionFileHandler,
  useClass: CompressionFileHandler,
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

export const getThumbnailByIdFileApplication = {
  provide: TYPES.applications.IGetThumbnailByIdFileApplication,
  useClass: GetThumbnailByIdFileApplication,
};

export const getZippedBucketFileApplication = {
  provide: TYPES.applications.IGetZippedBucketFileApplication,
  useClass: GetZippedBucketFileApplication,
};

export const deleteFileApplicationProvider = {
  provide: TYPES.applications.IDeleteFileApplication,
  useClass: DeleteFileApplication,
};

export const deleteBucketFileApplicationProvider = {
  provide: TYPES.applications.IDeleteBucketFileApplication,
  useClass: DeleteBucketFileApplication,
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

export const createThumbnailFileServiceProvider = {
  provide: TYPES.services.ICreateThumbnailFileService,
  useClass: CreateThumbnailFileService,
};

export const zipBucketFilseServiceProvider = {
  provide: TYPES.services.IZipBucketFileService,
  useClass: ZipBucketFileService,
};

export const deleteFileServiceProvider = {
  provide: TYPES.services.IDeleteFileService,
  useClass: DeleteFileService,
};

export const deleteFullFileServiceProvider = {
  provide: TYPES.services.IDeleteFullFileService,
  useClass: DeleteFullFileService,
};

export const deleteThumbnailFileServiceProvider = {
  provide: TYPES.services.IDeleteThumbnailFileService,
  useClass: DeleteThumbnailFileService,
};

export const deleteBucketFileServiceProvider = {
  provide: TYPES.services.IDeleteBucketFileService,
  useClass: DeleteBucketFileService,
};

export const handlersFileProviders = [
  storageFileHandlerProvider,
  creatorsThumbnailFileHandlerProvider,
  compressionFileHandlerProvider,
];

export const applicationsFileProviders = [
  getByNameAndBucketFileApplicationProvider,
  getByIdFileApplicationProvider,
  createFileApplicationProvider,
  closeFileApplicationProvider,
  getAssetFileApplicationProvider,
  getThumbnailByIdFileApplication,
  getZippedBucketFileApplication,
  deleteFileApplicationProvider,
  deleteBucketFileApplicationProvider,
];

export const servicesFileProviders = [
  getByIdFileServiceProvider,
  getInfoFileServiceProvider,
  getOrCreateFileServiceProvider,
  storeFileSericeProvider,
  closeFileServiceProvider,
  fetchFileServiceProvider,
  thumbnailFileHandlerProvider,
  createThumbnailFileServiceProvider,
  zipBucketFilseServiceProvider,
  deleteFileServiceProvider,
  deleteFullFileServiceProvider,
  deleteThumbnailFileServiceProvider,
  deleteBucketFileServiceProvider,
];
