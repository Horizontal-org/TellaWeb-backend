export const TYPES = {
  applications: {
    IGetByNameAndBucketFileApplication: 'IGetByNameAndBucketFileApplication',
    IGetByIdFileApplication: 'IGetByIdFileApplication',
    ICreateFileApplication: 'ICreateFileApplication',
    ICloseFileApplication: 'ICloseFileApplication',
    IGetAssetFileApplication: 'IGetAssetFileApplication',
    IGetThumbnailByIdFileApplication: 'IGetThumbnailByIdFileApplication',
    IGetZippedBucketFileApplication: 'IGetZippedBucketFileApplication',
  },
  services: {
    IGetByIdFileService: 'IGetByIdFileService',
    IGetInfoFileService: 'IGetInfoFileService',
    IGetOrCreateFileService: 'IGetOrCreateFileService',
    IStoreFileService: 'IStoreFileService',
    ICloseFileService: 'ICloseFileService',
    IFetchFileService: 'IFetchFileService',
    ICreateThumbnailFileService: 'ICreateThumbnailFileService',
    IZipBucketFileService: 'IZipBucketFileService',
  },
  handlers: {
    IStorageFileHandler: 'IStorageFileHandler',
    ICompressionHandler: 'ICompressionHandler',
    ICreatorThumbnailFileHandler: 'ICreatorThumbnailFileHandler',
    IThumbnailFileHandler: 'IThumbnailFileHandler',
    ICompressionFileHandler: 'ICompressionFileHandler',
  },
};
