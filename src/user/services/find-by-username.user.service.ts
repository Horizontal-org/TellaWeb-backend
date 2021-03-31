import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'user/domain/user.entity';
import { NotFoundUserException } from 'user/exceptions/not-found.user.exeptrion';
import { IFindByUsernameUserService } from 'user/interfaces/services/find-by-username.user.service.interface';

export class FindByUsernameUserService implements IFindByUsernameUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) throw new NotFoundUserException();

    return user;
  }
}
