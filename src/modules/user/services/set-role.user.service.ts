import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity, RolesUser } from '../domain';
import { ChangeRoleUserDto } from '../dto';

@Injectable()
export class SetRoleUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepositorty: Repository<UserEntity>,
  ) {}

  async execute({ username, isAdmin }: ChangeRoleUserDto): Promise<UserEntity> {
    const user = await this.userRepositorty.findOne({ where: { username } });
    if (!user) throw new NotFoundException();

    user.role = isAdmin ? RolesUser.ADMIN : RolesUser.USER;

    return await this.userRepositorty.save(user);
  }
}
