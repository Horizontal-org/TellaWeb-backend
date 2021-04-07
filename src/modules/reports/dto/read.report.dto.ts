import { Exclude, Expose, Type } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { FileDto } from 'modules/files/dto';
import { ReadUserDto } from 'modules/user/dto';

@Exclude()
export class ReadReportDto {
  @ApiProperty()
  @Expose()
  @IsUUID('4')
  id: string;

  @ApiProperty()
  @Expose()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @Expose()
  @IsString()
  readonly description: string;

  @ApiProperty({ type: [FileDto] })
  @Expose()
  @Type(() => FileDto)
  files: FileDto[];

  @ApiProperty()
  @Expose()
  @Type(() => ReadUserDto)
  author: ReadUserDto;
}
