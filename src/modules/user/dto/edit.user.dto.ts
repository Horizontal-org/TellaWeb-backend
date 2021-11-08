import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Exclude()
export class EditUserDto {
  @IsUUID('4')
  @Expose()
  id?: string;

  @ApiProperty({ type: Boolean })
  @Expose()
  isAdmin?: boolean;

  @ApiProperty({ type: String })
  @Expose()
  password?: string;
}
