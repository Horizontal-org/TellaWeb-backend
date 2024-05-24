import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class UpdateGlobalSettingDto {  
  @ApiProperty()
  @Expose()
  @IsUUID()
  id: string;

  @ApiProperty()
  @Expose()
  @IsBoolean()
  readonly enabled: boolean;
}
