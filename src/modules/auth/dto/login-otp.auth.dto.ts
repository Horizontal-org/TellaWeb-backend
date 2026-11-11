import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginOtpAuthDto {
  @ApiProperty()
  @IsString()
  mfa_token: string;

  @ApiProperty()
  @IsString()
  code: string;
}
