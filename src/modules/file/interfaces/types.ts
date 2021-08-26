export const TYPES = {
  applications: {
    IGetByNameAndBucketFileApplication: 'IGetByNameAndBucketFileApplication',
    IGetByIdFileApplication: 'IGetByIdFileApplication',
    ICreateFileApplication: 'ICreateFileApplication',
    ICloseFileApplication: 'ICloseFileApplication',
    IGetAssetFileApplication: 'IGetAssetFileApplication',
    IGetThumbnailByIdFileApplication: 'IGetThumbnailByIdFileApplication',
  },
  services: {
    IGetByIdFileService: 'IGetByIdFileService',
    IGetInfoFileService: 'IGetInfoFileService',
    IGetOrCreateFileService: 'IGetOrCreateFileService',
    IStoreFileService: 'IStoreFileService',
    ICloseFileService: 'ICloseFileService',
    IFetchFileService: 'IFetchFileService',
    ICreateThumbnailFileService: 'ICreateThumbnailFileService',
  },
  handlers: {
    IStorageFileHandler: 'IStorageFileHandler',
    ICreatorThumbnailFileHandler: 'ICreatorThumbnailFileHandler',
    IThumbnailFileHandler: 'IThumbnailFileHandler',
  },
};
