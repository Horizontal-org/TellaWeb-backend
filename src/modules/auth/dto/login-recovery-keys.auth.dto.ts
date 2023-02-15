import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginRecoveryKeysAuthDto {  
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  password: string;
}
