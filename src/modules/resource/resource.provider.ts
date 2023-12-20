import { TYPES } from './interfaces';

import { ListResourceService } from './services/list.resource.service';
import { UploadResourceService } from './services/upload.resource.service';
import { CloseResourceService } from './services/close.resource.service';
import { CheckNameResourceService } from './services/check-name.resource.service';
import { DeleteResourceService } from './services/delete.resource.service';
import { DownloadResourceService } from './services/download.resource.service';
import { GetByProjectsResourceService } from './services/get-by-projects.resource.service'

export const listResourceServiceProvider = {
  provide: TYPES.services.IListResourceService,
  useClass: ListResourceService,
};

export const uploadResourceServiceProvider = {
  provide: TYPES.services.IUploadResourceService,
  useClass: UploadResourceService
}

export const closeResourceServiceProvider = {
  provide: TYPES.services.ICloseResourceService,
  useClass: CloseResourceService
}

export const checkNameResourceServiceProvider = {
  provide: TYPES.services.ICheckNameResourceService,
  useClass: CheckNameResourceService
}

export const deleteResourceServiceProvider = {
  provide: TYPES.services.IDeleteResourceService,
  useClass: DeleteResourceService
}

export const downloadResourceServiceProvider = {
  provide: TYPES.services.IDownloadResourceService,
  useClass: DownloadResourceService
}


export const getByProjectsResourceServiceProvider = {
  provide: TYPES.services.IGetByProjectsResourceService,
  useClass: GetByProjectsResourceService
}

export const applicationsResourceProviders = [
];

export const servicesResourceProviders = [
  listResourceServiceProvider,
  uploadResourceServiceProvider,
  closeResourceServiceProvider,
  checkNameResourceServiceProvider,
  deleteResourceServiceProvider,
  downloadResourceServiceProvider,
  getByProjectsResourceServiceProvider
];

// export const guardsProjectProviders = [
//   projectAccessGuardProvider
// ]