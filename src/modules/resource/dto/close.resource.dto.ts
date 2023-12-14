import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class CloseResourceDto {

  @ApiProperty()
  @Expose()
  @IsOptional()
  fileName: string;  
}
