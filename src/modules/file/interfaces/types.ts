export const TYPES = {
  applications: {
    IGetByNameAndBucketFileApplication: 'IGetByNameAndBucketFileApplication',
    IGetByIdFileApplication: 'IGetByIdFileApplication',
    ICreateFileApplication: 'ICreateFileApplication',
    ICloseFileApplication: 'ICloseFileApplication',
    IGetAssetFileApplication: 'IGetAssetFileApplication',
    IGetThumbnailByIdFileApplication: 'IGetThumbnailByIdFileApplication',
    IGetZippedBucketFileApplication: 'IGetZippedBucketFileApplication',
    IDeleteFileApplication: 'IDeleteFileApplication',
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
    IDeleteFileService: 'IDeleteFileService',
    IDeleteFullFileService: 'IDeleteFullFileService',
    IDeleteThumbnailFileService: 'IDeleteThumbnailFileService',
  },
  handlers: {
    IStorageFileHandler: 'IStorageFileHandler',
    ICompressionHandler: 'ICompressionHandler',
    ICreatorThumbnailFileHandler: 'ICreatorThumbnailFileHandler',
    IThumbnailFileHandler: 'IThumbnailFileHandler',
    ICompressionFileHandler: 'ICompressionFileHandler',
  },
};
