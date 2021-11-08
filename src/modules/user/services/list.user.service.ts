import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../domain';
import { IListUserService } from '../interfaces';

@Injectable()
export class ListUserService implements IListUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async execute(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }
}
