import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../domain';
import { EditUserDto } from '../dto';
import { NotFoundUserException } from '../exceptions';
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

    user.update(editUserDto);
    const updatedUser = await this.userRepository.save(user);

    return updatedUser;
  }
}
