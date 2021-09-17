import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsUUID } from 'class-validator';

export class EditRemoteConfigurationDto {
  @ApiProperty()
  @IsUUID('4')
  id: string;

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
