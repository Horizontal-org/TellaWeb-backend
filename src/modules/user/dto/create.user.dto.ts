import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { RolesUser } from '../domain';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Length(6, 60)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: RolesUser })
  @IsOptional()
  @IsEnum(RolesUser)
  role?: RolesUser;
}
