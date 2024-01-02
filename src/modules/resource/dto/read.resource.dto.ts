import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


import { ResourceEntity } from '../domain';
import { ProjectEntity } from 'modules/project/domain';

@Exclude()
export class ReadResourceDto {
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
  readonly fileName: string;

  @ApiProperty()
  @Expose()
  @IsString()
  readonly size: string;


  @ApiProperty()
  @Expose()
  @IsString()
  readonly createdAt: string;

  @ApiProperty()
  @Expose()
  @IsArray()
  readonly projects: ProjectEntity[];


  public toEntity() {
    const resource = new ResourceEntity();
    resource.id = this.id;

    return resource;
  }
}
