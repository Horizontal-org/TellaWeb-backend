import { CreateUserDto } from '../../dto';

export interface ICreateUserApplication {
  execute(createUserDto: CreateUserDto): Promise<boolean>;
}
