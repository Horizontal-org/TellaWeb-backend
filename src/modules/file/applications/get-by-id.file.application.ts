import { Inject, Injectable } from '@nestjs/common';

import { FileDto } from '../dto';
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

  async execute(id: string): Promise<FileDto> {
    return this.getByIdFileService.execute(id);
  }
}
