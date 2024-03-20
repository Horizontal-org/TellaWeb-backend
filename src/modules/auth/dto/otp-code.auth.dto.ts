import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OtpCodeAuthDto {  
  @ApiProperty()
  @IsString()
  code: string;
}
