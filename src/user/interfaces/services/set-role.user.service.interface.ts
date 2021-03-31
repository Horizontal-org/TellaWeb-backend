import { User } from 'user/domain/user.entity';
import { UserRoleDto } from 'user/dto/UserRole.dto';

export interface ISetRoleUserService {
  execute(userRoleDto: UserRoleDto): Promise<User>;
}
