import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../domain';
import { NotFoundUserException } from '../exceptions';
import { IFindByUsernameUserService } from '../interfaces';
import { AbilityFactory, Actions } from 'casl/casl-ability.factory';
import { UnauthorizedException } from '@nestjs/common';

export class FindByUsernameUserService implements IFindByUsernameUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async execute(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { username: username, deletedAt: null } });
    const ability = this.abilityFactory.createForUser(user)
    
    if (ability.cannot(Actions.Read, user)) throw new UnauthorizedException()
    
    if (!user) throw new NotFoundUserException();

    return user;
  }
}
