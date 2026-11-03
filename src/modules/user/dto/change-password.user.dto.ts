import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordUserDto {
  @ApiProperty()
  @IsString()
  current: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  new: string;
}
