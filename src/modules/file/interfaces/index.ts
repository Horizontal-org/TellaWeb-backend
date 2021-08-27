export { ICloseFileApplication } from './applications/close.file.application.interface';
export { ICreateFileApplication } from './applications/create.file.application.interface';
export { IGetByNameAndBucketFileApplication } from './applications/get-by-name-and-bucket.file.application.interface';
export { IGetByIdFileApplication } from './applications/get-by-id.file.application.inteface';
export { IGetAssetFileApplication } from './applications/get-asset.file.application.interface';
export { IGetThumbnailByIdFileApplication } from './applications/get-thumbnail-by-id.file.application.interface';
export { IGetZippedBucketFileApplication } from './applications/get-zipped-bucket.file.application.interface';

export { ICloseFileService } from './services/close.file.service.interface';
export { IStoreFileService } from './services/store.file.service.interface';
export { IGetInfoFileService } from './services/get-info.file.service.interface';
export { IGetByIdFileService } from './services/getById.file.service.interface';
export { IGetOrCreateFileService } from './services/get-or-create.file.service.interface';
export { IFetchFileService } from './services/fetch.file.service.interface';
export { ICreateThumbnailFileService } from './services/create-thumbnail.file.service.interface';
export { IZipBucketFileService } from './services/zip-bucket.service.interface';

export { IStorageFileHandler } from './handlers/storage.file.handler.inteface';
export {
  ICreatorThumbnailFileHandler,
  IThumbnailFileHandler,
} from './handlers/thumbnail.file.handler.interface';
export { ICompressionFileHandler } from './handlers/compression.file.handler.interface';

export { TYPES } from './types';
