import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../domain';
import { NotFoundUserException } from '../exceptions';
import { IFindByIdUserService } from '../interfaces';

export class FindByidUserService implements IFindByIdUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: id, deletedAt: null } });
    if (!user) throw new NotFoundUserException();

    return user;
  }
}
