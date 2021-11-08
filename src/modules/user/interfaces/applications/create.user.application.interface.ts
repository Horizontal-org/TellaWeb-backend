import { CreateUserDto, ReadUserDto } from '../../dto';

export interface ICreateUserApplication {
  execute(createUserDto: CreateUserDto): Promise<ReadUserDto>;
}
