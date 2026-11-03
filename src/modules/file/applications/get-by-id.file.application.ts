import { Inject, Injectable } from '@nestjs/common';

import { FileDto } from '../dto';
import { NotFoundFileException } from '../exceptions';
import {
  TYPES,
  IGetByIdFileApplication,
  IGetByIdFileService,
} from '../interfaces';

@Injectable()
export class GetByIdFileApplication implements IGetByIdFileApplication {
  constructor(
    @Inject(TYPES.services.IGetByIdFileService)
    private readonly getByIdFileService: IGetByIdFileService,
  ) {}

  // bucket is the report id; checking it stops a fileId from another report
  // being read through a report the user does have access to
  async execute(id: string, bucket: string): Promise<FileDto> {
    const file = await this.getByIdFileService.execute(id);
    if (!file || file.bucket !== bucket) {
      throw new NotFoundFileException(id);
    }
    return file;
  }
}
