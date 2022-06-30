import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, Length } from 'class-validator';
import { RolesUser } from '../domain';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Length(6, 60)
  username: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({ type: String })
  @IsString()
  role?: RolesUser;
}
