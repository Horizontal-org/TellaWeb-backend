import { Inject, Injectable } from '@nestjs/common';

import {
  IDeleteFileApplication,
  IDeleteFileService,
  IDeleteFullFileService,
  IDeleteThumbnailFileService,
  IGetByIdFileApplication,
  TYPES,
} from '../interfaces';

@Injectable()
export class DeleteFileApplication implements IDeleteFileApplication {
  constructor(
    @Inject(TYPES.applications.IGetByIdFileApplication)
    private readonly getByIdFileApplication: IGetByIdFileApplication,
    @Inject(TYPES.services.IDeleteFileService)
    private readonly deleteFileService: IDeleteFileService,
    @Inject(TYPES.services.IDeleteThumbnailFileService)
    private readonly deleteFullFileService: IDeleteFullFileService,
    @Inject(TYPES.services.IDeleteFullFileService)
    private readonly deleteThumbnailFileService: IDeleteThumbnailFileService,
  ) {}

  async execute(fileId: string): Promise<boolean> {
    const readFileDto = await this.getByIdFileApplication.execute(fileId);

    await this.deleteFileService.execute(fileId);
    await this.deleteFullFileService.execute(readFileDto);
    await this.deleteThumbnailFileService.execute(readFileDto);
    return true;
  }
}
