import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsJSON, IsBoolean } from 'class-validator';

export class CreateRemoteConfigurationDto {
  @ApiProperty()
  @IsString()
  name: string;

  // @ApiProperty(
  // @IsArray()
  // applock: boolean[] = [false, false, false];

  @ApiProperty()
  @IsJSON()
  camouflage?: {visible: boolean, change_name: boolean, calculator: boolean};

  @ApiProperty()
  @IsJSON()
  crashReports?: {visible: boolean, enabled: boolean};

  @ApiProperty()
  @IsBoolean()
  serversVisible?: boolean;

  // @ApiProperty()
  // @IsString()
  // defaultUser?: string;

  // @ApiProperty()
  // @IsString()
  // apiUrl?: string;
}
