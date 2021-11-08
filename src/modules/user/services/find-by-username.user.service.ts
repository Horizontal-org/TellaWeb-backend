import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../domain';
import { NotFoundUserException } from '../exceptions';
import { IFindByUsernameUserService } from '../interfaces';

export class FindByUsernameUserService implements IFindByUsernameUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) throw new NotFoundUserException();

    return user;
  }
}
