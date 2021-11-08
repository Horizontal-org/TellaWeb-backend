import { IsString } from 'class-validator';

export class CredentialUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
