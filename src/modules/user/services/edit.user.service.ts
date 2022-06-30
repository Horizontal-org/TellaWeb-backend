import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbilityFactory, Actions } from 'casl/casl-ability.factory';
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
    private readonly abilityFactory: AbilityFactory,

  ) {}

  async execute(editUserDto: EditUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne(editUserDto.id);
    const ability = this.abilityFactory.createForUser(user);

    if (ability.cannot(Actions.Update, user)) throw new UnauthorizedException();
    
    if (!user) throw new NotFoundUserException();

    if (editUserDto.username) {
      const taken = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id <> :id', { id: editUserDto.id })
        .andWhere('user.username = :username', { username: editUserDto.username })
        .getCount();
      
      if (taken) {
        throw new AlreadyExistUserException(editUserDto.username);
      }
    }

    user.update(editUserDto);
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }
}
