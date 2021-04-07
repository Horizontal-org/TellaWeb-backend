import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { hashPassword } from 'common/utils/password.utils';

import { CreateUserDto, ReadUserDto } from '../dto';
import {
  TYPES,
  ICreateUserApplication,
  ICreateUserService,
} from '../interfaces';

@Injectable()
export class CreateUserApplication implements ICreateUserApplication {
  constructor(
    @Inject(TYPES.services.ICreateUserService)
    private readonly createUserService: ICreateUserService,
  ) {}
  async execute(createUserDto: CreateUserDto): Promise<ReadUserDto> {
    const password = await hashPassword(createUserDto.password);
    const user = await this.createUserService.execute({
      ...createUserDto,
      password,
    });

    return plainToClass(ReadUserDto, user);
  }
}
