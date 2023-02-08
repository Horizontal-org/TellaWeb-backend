import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmPasswordUserDto {
  @ApiProperty()
  @IsString()
  current: string;
}
