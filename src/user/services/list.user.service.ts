import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'user/domain/user.entity';
import { IListUserService } from 'user/interfaces/services/list.user.service.interface';

@Injectable()
export class ListUserService implements IListUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async execute(): Promise<User[]> {
    return await this.userRepository.find();
  }
}
