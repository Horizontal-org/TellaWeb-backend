import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CloseFileDto {
  @IsString()
  @IsOptional()
  fileName: string;

  @IsUUID('4')
  @IsOptional()
  bucket: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fileInfo: unknown;
}
