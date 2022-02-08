import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../domain';
import { EditUserDto } from '../dto';
import {
  AlreadyExistUserException,
  NotFoundUserException,
} from '../exceptions';
import { IEditUserService } from '../interfaces';

@Injectable()
export class EditUserService implements IEditUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(editUserDto: EditUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne(editUserDto.id);
    if (!user) throw new NotFoundUserException();

    if (editUserDto.username) {
      const taken = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id <> :id', { id: editUserDto.id })
        .where('user.username = :username', { username: editUserDto.username })
        .getCount();
      if (taken) {
        throw new AlreadyExistUserException(editUserDto.username);
      }
    }

    console.log('editUserDto', editUserDto);
    user.update(editUserDto);
    console.log(user);
    const updatedUser = await this.userRepository.save(user);
    console.log(updatedUser);
    return updatedUser;
  }
}
