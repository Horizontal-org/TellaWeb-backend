import { CloseResourceController } from './close.resource.controller';
import { ListResourceController } from './list.resource.controller';
import { UploadResourceController } from './upload.resource.controller';
import { CheckNameResourceController } from './check-name.resource.controller';
import { DeleteResourceController } from './delete.resource.controller'
import { DownloadResourceController } from './download.resource.controller';
import { GetAssetResourceController } from './get-asset.resource.controller';
import { GetByProjectsResourceController } from './get-by-projects.resource.controller'

export const resourceControllers = [
  ListResourceController,
  UploadResourceController,
  CloseResourceController,
  CheckNameResourceController,
  DeleteResourceController,
  DownloadResourceController,
  GetAssetResourceController,
  GetByProjectsResourceController
];
