import { Exclude, Expose, Transform } from 'class-transformer';
import { IsArray, IsDate, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ReadRemoteConfigurationDto {
  @ApiProperty()
  @Expose()
  @IsUUID('4')
  id: string;

  @ApiProperty()
  @Expose()
  @IsString()
  shortCode: string;

  @ApiProperty()
  @Expose()
  @IsString()
  name: string;

  @ApiProperty()
  @Expose()
  @IsString()
  defaultUser?: string;

  @ApiProperty()
  @IsString()
  apiUrl?: string;

  @ApiProperty()
  @Expose()
  @IsArray()
  @Transform(({ value }) =>
    value.map(
      (option: string | boolean) => option !== 'false' && option !== false,
    ),
  )
  applock: boolean[];

  @ApiProperty()
  @Expose()
  @IsArray()
  @Transform(({ value }) =>
    value.map(
      (option: string | boolean) => option !== 'false' && option !== false,
    ),
  )
  camoflage: boolean[];

  @ApiProperty()
  @Expose({ name: 'created_at' })
  @IsDate()
  date: Date;
}
