import { Exclude, Expose, Type } from 'class-transformer';
import { IsJSON, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { FileDto } from 'modules/file/dto';
import { ReadUserDto } from 'modules/user/dto';
import { ReportEntity } from '../domain';

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

  @ApiProperty()
  @Expose()
  @IsString()
  readonly createdAt: string;

  @ApiProperty()
  @Expose()
  @IsJSON()
  deviceInfo: unknown;


  @ApiProperty({ type: [FileDto] })
  @Expose()
  @Type(() => FileDto)
  files: FileDto[];

  @ApiProperty()
  @Expose()
  @Type(() => ReadUserDto)
  author: ReadUserDto;

  public toEntity() {
    const report = new ReportEntity();
    report.id = this.id;

    return report;
  }
}
