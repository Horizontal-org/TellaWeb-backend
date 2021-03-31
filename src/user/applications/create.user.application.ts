import { Inject, Injectable } from '@nestjs/common';
import { hashPassword } from 'common/utils/password.utils';
import { UserId } from 'user/domain/user-id.dv';
import { CreateUserDto } from 'user/dto/CreateUser.dto';
import { ICreateUserApplication } from 'user/interfaces/applications/create.user.application.interface';
import { ICreateUserService } from 'user/interfaces/services/create.user.service.interface';
import { TYPES } from 'user/interfaces/types';
@Injectable()
export class CreateUserApplication implements ICreateUserApplication {
  constructor(
    @Inject(TYPES.services.ICreateUserService)
    private readonly createUserService: ICreateUserService,
  ) {}
  async execute(createUserDto: CreateUserDto): Promise<UserId> {
    const password = await hashPassword(createUserDto.password);
    const user = await this.createUserService.execute({
      ...createUserDto,
      password,
    });

    return user.id;
  }
}
