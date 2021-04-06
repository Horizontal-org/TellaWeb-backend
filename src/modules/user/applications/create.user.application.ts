import { Inject, Injectable } from '@nestjs/common';

import { hashPassword } from 'common/utils/password.utils';

import { CreateUserDto } from '../dto';
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
  async execute(createUserDto: CreateUserDto): Promise<boolean> {
    const password = await hashPassword(createUserDto.password);
    await this.createUserService.execute({
      ...createUserDto,
      password,
    });

    return true;
  }
}
