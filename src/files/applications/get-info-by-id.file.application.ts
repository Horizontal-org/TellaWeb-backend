import { Inject, Injectable } from '@nestjs/common';
import { FileInfoDto } from '../dto/file-info.dto';
import { IGetInfoByIdFileApplication } from '../interfaces/applications/get-info-by-id.file.application';
import { IGetInfoFileService } from '../interfaces/services/get-info.file.service.interface';
import { IGetByIdFileService } from '../interfaces/services/getById.file.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class GetInfoByIdFileApplication implements IGetInfoByIdFileApplication {
  constructor(
    @Inject(TYPES.services.IGetInfoFileService)
    private readonly getStatusFileService: IGetInfoFileService,
    @Inject(TYPES.services.IGetByIdFileService)
    private readonly getByIdFileService: IGetByIdFileService,
  ) {}

  async execute(id: string): Promise<FileInfoDto> {
    const fileDto = await this.getByIdFileService.execute(id);
    return this.getStatusFileService.execute(fileDto);
  }
}
