import { Inject, Injectable } from '@nestjs/common';

import { FileDto } from '../dto';
import { TYPES, IGetByIdFileService } from '../interfaces';

@Injectable()
export class GetByIdFileApplication {
  constructor(
    @Inject(TYPES.services.IGetByIdFileService)
    private readonly getByIdFileService: IGetByIdFileService,
  ) {}

  async execute(id: string): Promise<FileDto> {
    return this.getByIdFileService.execute(id);
  }
}
