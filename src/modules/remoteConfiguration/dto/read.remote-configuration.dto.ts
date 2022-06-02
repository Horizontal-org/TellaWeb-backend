import { Exclude, Expose, Transform } from 'class-transformer';
import { IsArray, IsDate, isJSON, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ReadRemoteConfigurationDto {
  @ApiProperty()
  @Expose()
  @IsUUID('4')
  id: string;

  // @ApiProperty()
  // @Expose()
  // @IsString()
  // shortCode: string;

  @ApiProperty()
  @Expose()
  @IsString()
  name: string;


  @ApiProperty()
  @Expose()
  // @isJSON()
  camouflage?: {visible: boolean, change_name: boolean, calculator: boolean};

  @ApiProperty()
  @Expose()
  // @IsJSON()
  crashReports?: {visible: boolean, enabled: boolean};

  @ApiProperty()
  @Expose()
  // @IsBoolean()
  serversVisible?: boolean;

  @ApiProperty()
  @Expose()
  @IsString()
  readonly createdAt: string;
}
