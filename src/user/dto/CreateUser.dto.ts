import { Length } from 'class-validator';

export class CreateUserDto {
  @Length(6, 20)
  username: string;

  @Length(59, 60)
  password: string;

  isAdmin: boolean;
}
