import { Inject, Injectable } from '@nestjs/common';

import { InfoFileDto, ReadFileDto } from '../dto';
import {
  TYPES,
  IGetInfoFileService,
  IGetByNameAndBucketFileApplication,
} from '../interfaces';

@Injectable()
export class GetByNameAndBucketFileApplication
  implements IGetByNameAndBucketFileApplication {
  constructor(
    @Inject(TYPES.services.IGetInfoFileService)
    private readonly getInfoFileService: IGetInfoFileService,
  ) {}

  async execute(getInfoDto: ReadFileDto): Promise<InfoFileDto> {
    return this.getInfoFileService.execute(getInfoDto);
  }
}
