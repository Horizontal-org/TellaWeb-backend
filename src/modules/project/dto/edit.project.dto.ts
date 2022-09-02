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
  @IsArray()
  users: Array<string>

  @ApiProperty()
  @IsOptional()
  @IsArray()
  reports: Array<string>  
}
