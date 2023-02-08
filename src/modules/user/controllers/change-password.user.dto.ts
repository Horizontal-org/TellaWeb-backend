import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangePasswordUserDto {
  @ApiProperty()
  @IsString()
  current: string;

  @ApiProperty()
  @IsString()
  new: string;
}
