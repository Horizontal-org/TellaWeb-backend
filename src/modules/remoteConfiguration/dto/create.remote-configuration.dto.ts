import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';

export class CreateRemoteConfigurationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsArray()
  applock: boolean[] = [false, false, false];

  @ApiProperty()
  @IsArray()
  camoflage: boolean[] = [false, false, false];
}
