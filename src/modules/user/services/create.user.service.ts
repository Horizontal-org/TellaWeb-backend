import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity, RolesUser } from '../domain';
import { CreateUserDto } from '../dto';
import { AlreadyExistUserException } from '../exceptions';
import { ICreateUserService } from '../interfaces';

@Injectable()
export class CreateUserService implements ICreateUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute({
    username,
    password,
    role,
  }: CreateUserDto): Promise<UserEntity> {
    const exist = await this.userRepository.findOne({
      where: { username },
    });
    if (exist) throw new AlreadyExistUserException(username);

    const user = new UserEntity();
    user.username = username;
    user.password = password;
    user.role = role;

    return this.userRepository.save(user);
  }
}
