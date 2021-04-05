import { Inject, Injectable } from '@nestjs/common';
import { FileInfoDto } from '../dto/file-info.dto';
import { FileInputDto } from '../dto/file-input.dto';
import { IGetByNameAndBucketFileApplication } from '../interfaces/applications/get-by-name-and-bucket.file.application.interface';
import { IGetInfoFileService } from '../interfaces/services/get-info.file.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class GetByNameAndBucketFileApplication
  implements IGetByNameAndBucketFileApplication {
  constructor(
    @Inject(TYPES.services.IGetInfoFileService)
    private readonly getInfoFileService: IGetInfoFileService,
  ) {}

  async execute(getInfoDto: FileInputDto): Promise<FileInfoDto> {
    return this.getInfoFileService.execute(getInfoDto);
  }
}
