import { UserEntity } from '../../domain';
import { ChangeRoleUserDto } from '../../dto';

export interface ISetRoleUserService {
  execute(changeRoleUserDto: ChangeRoleUserDto): Promise<UserEntity>;
}
