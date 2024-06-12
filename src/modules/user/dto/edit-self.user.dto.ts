import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class EditSelfUserDto {
  @ApiProperty({ type: String })
  @IsEmail()
  @Expose()
  username?: string;

  @ApiProperty({ type: String })
  @IsString()
  @Expose()
  confirmPassword?: string;
}
