import { IsBoolean, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(6, 20)
  username: string;

  @IsString()
  @Length(59, 60)
  password: string;

  @IsBoolean()
  isAdmin = false;
}
