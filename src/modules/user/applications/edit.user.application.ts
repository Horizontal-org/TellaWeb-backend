import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { EditUserDto, ReadUserDto } from '../dto';
import { IEditUserApplication, IEditUserService, TYPES } from '../interfaces';

@Injectable()
export class EditUserApplication implements IEditUserApplication {
  constructor(
    @Inject(TYPES.services.IEditUserService)
    private readonly editUserService: IEditUserService,
  ) {}

  async execute(editUserDto: EditUserDto): Promise<ReadUserDto> {
    const user = await this.editUserService.execute(editUserDto);
    return plainToClass(ReadUserDto, user, { excludeExtraneousValues: true });
  }
}
