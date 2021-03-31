import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRoles } from 'user/domain/user-roles.enum';
import { User } from 'user/domain/user.entity';
import { CreateUserDto } from 'user/dto/CreateUser.dto';
import { UserAlreadyExist } from 'user/exceptions/user-already-exist.user.exception';
import { ICreateUserService } from 'user/interfaces/services/create.user.service.interface';

@Injectable()
export class CreateUserService implements ICreateUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute({ username, password, isAdmin }: CreateUserDto): Promise<User> {
    const exist = await this.userRepository.findOne({
      where: { username },
    });
    if (exist) throw new UserAlreadyExist(username);

    const user = new User();
    user.username = username;
    user.password = password;
    user.role = isAdmin ? UserRoles.ADMIN : UserRoles.USER;

    return this.userRepository.save(user);
  }
}
