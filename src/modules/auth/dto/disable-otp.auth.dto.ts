import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class DisableOtpAuthDto {  
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsBoolean()
  is_otp: boolean;


  @ApiProperty()
  @IsString()
  confirm_password: string;
}
