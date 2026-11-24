import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditProjectDto {
  @IsUUID('4')
  @IsOptional()
  id?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  slug: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  users: Array<string>;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  resources: Array<string>;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  reports: Array<string>;
}
