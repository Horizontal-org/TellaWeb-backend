import { Exclude, Expose, Type } from 'class-transformer';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ReadReportDto } from 'modules/report/dto';
import { ReadUserDto } from 'modules/user/dto';
import { ReadResourceDto } from 'modules/resource/dto';

@Exclude()
export class ByProjectResourceDto {
  @ApiProperty()
  @Expose()
  @IsUUID('4')
  id: string;

  @ApiProperty()
  @Expose()
  @IsString()
  name: string;

  @ApiProperty()
  @Expose()
  @IsString()
  slug: string;

  @ApiProperty()
  @Expose()
  @IsString()
  url: string;
  
  @ApiProperty()
  @Expose()
  @Type(() => ReadResourceDto)
  resources: ReadResourceDto[];

  @ApiProperty()
  @Expose()
  @IsString()
  readonly createdAt: string;

  @ApiProperty({ type: String })
  @Expose()
  note?: string;
}
