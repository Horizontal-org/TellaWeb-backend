import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EnableOtpAuthDto {  
  @ApiProperty()
  @IsString()
  password: string;
}
