import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

export class EditSelfUserDto {
  @ApiProperty({ type: String })
  @IsEmail()
  @Length(6, 60)
  @Expose()
  username?: string;

  @ApiProperty({ type: String })
  @IsString()
  @Expose()
  confirmPassword?: string;
}
