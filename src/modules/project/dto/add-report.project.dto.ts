import { Exclude, Expose, Type } from 'class-transformer';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CreateReportDto, ReadReportDto } from 'modules/report/dto';
import { ReadUserDto } from 'modules/user/dto';

@Exclude()
export class AddReportProjectDto {
  @ApiProperty()
  @Expose()
  @Type(() => CreateReportDto)
  report: CreateReportDto;
}
