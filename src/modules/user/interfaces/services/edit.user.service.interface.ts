import { UserEntity } from '../../domain';
import { EditUserDto } from '../../dto';

export interface IEditUserService {
  execute(editUserDto: EditUserDto): Promise<UserEntity>;
}
