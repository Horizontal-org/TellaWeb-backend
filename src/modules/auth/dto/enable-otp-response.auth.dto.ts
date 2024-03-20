import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EnableOtpResponseAuthDto {  
  @IsString()
  otp_url: string;


  @IsString()
  otp_code: string;
}
