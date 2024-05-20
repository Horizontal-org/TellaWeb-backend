import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


import { GlobalSettingEntity } from '../domain';

@Exclude()
export class ReadGlobalSettingDto {
  @ApiProperty()
  @Expose()
  @IsUUID('4')
  id: string;

  @ApiProperty()
  @Expose()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @Expose()
  @IsString()
  readonly value: string;

  public toEntity() {
    const globalSetting = new GlobalSettingEntity();
    globalSetting.id = this.id;

    return globalSetting;
  }
}
