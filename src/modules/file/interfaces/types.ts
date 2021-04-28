export const TYPES = {
  applications: {
    IGetByNameAndBucketFileApplication: 'IGetByNameAndBucketFileApplication',
    IGetByIdFileApplication: 'IGetByIdFileApplication',
    ICreateFileApplication: 'ICreateFileApplication',
    ICloseFileApplication: 'ICloseFileApplication',
    IGetAssetFileApplication: 'IGetAssetFileApplication',
  },
  services: {
    IGetByIdFileService: 'IGetByIdFileService',
    IGetInfoFileService: 'IGetInfoFileService',
    IGetOrCreateFileService: 'IGetOrCreateFileService',
    IStoreFileService: 'IStoreFileService',
    ICloseFileService: 'ICloseFileService',
    IFetchFileService: 'IFetchFileService',
  },
  handlers: {
    IStorageFileHandler: 'IStorageFileHandler',
  },
};
