import { User } from 'user/domain/user.entity';
import { CreateUserDto } from 'user/dto/CreateUser.dto';

export interface ICreateUserService {
  execute(createUserDto: CreateUserDto): Promise<User>;
}
