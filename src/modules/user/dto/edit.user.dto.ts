import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Exclude()
export class EditUserDto {
  @IsUUID('4')
  id?: string;

  @ApiProperty({ type: Boolean })
  @Expose()
  isAdmin?: boolean;
}
