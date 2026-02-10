import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenAuthDto {
  @ApiProperty()
  @IsString()
  refresh_token: string;
}
