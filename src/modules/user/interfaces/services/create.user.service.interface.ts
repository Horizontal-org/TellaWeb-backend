import { UserEntity } from '../../domain';
import { CreateUserDto } from '../../dto';

export interface ICreateUserService {
  execute(createUserDto: CreateUserDto): Promise<UserEntity>;
}
