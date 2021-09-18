import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsDate, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ReadRemoteConfigurationDto {
  @ApiProperty()
  @Expose()
  @IsUUID('4')
  id: string;

  @ApiProperty()
  @Expose()
  @IsString()
  shortCode: string;

  @ApiProperty()
  @Expose()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  defaultUser?: string;

  @ApiProperty()
  @IsString()
  apiUrl?: string;

  @ApiProperty()
  @Expose()
  @IsArray()
  applock: boolean[];

  @ApiProperty()
  @Expose()
  @IsArray()
  camoflage: boolean[];

  @ApiProperty()
  @Expose({ name: 'created_at' })
  @IsDate()
  date: Date;
}
