import { ReadUserDto, EditUserDto } from '../../dto';

export interface IEditUserApplication {
  execute(editUserDto: EditUserDto): Promise<ReadUserDto>;
}
