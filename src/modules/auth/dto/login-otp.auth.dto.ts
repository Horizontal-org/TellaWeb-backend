import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginOtpAuthDto {  
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  code: string;
}
