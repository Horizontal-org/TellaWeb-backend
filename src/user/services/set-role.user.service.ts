import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRoles } from 'user/domain/user-roles.enum';
import { User } from 'user/domain/user.entity';
import { UserRoleDto } from 'user/dto/UserRole.dto';

@Injectable()
export class SetRoleUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepositorty: Repository<User>,
  ) {}

  async execute({ username, isAdmin }: UserRoleDto): Promise<User> {
    const user = await this.userRepositorty.findOne({ where: { username } });
    if (!user) throw new NotFoundException();

    user.role = isAdmin ? UserRoles.ADMIN : UserRoles.USER;

    return await this.userRepositorty.save(user);
  }
}
