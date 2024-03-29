import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditProjectDto {
  @IsUUID('4')
  @IsOptional()
  id?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  users: Array<string>

  @ApiProperty()
  @IsOptional()
  @IsArray()
  resources: Array<string>

  @ApiProperty()
  @IsOptional()
  @IsArray()
  reports: Array<string>  
}
