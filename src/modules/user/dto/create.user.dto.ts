import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Length(6, 20)
  username: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({ type: Boolean, default: false })
  @IsBoolean()
  isAdmin = false;
}
