import { Inject, Injectable } from '@nestjs/common';
import { FileDto } from '../dto/file.dto';
import { IGetByIdFileService } from '../interfaces/services/getById.file.service.interface';
import { TYPES } from '../interfaces/types';

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
