import { IsString } from 'class-validator';

export class ChangeRoleUserDto {
  @IsString()
  username: string;

  @IsString()
  isAdmin: boolean;
}
