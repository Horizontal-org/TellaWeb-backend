import { UserId } from 'user/domain/user-id.dv';
import { CreateUserDto } from 'user/dto/CreateUser.dto';

export interface ICreateUserApplication {
  execute(createUserDto: CreateUserDto): Promise<UserId>;
}
