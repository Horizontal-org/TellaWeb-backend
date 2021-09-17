import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsDate, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { boolean } from 'yargs';

@Exclude()
export class RemoteConfigurationReadDto {
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
