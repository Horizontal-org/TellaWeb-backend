import { Inject, Injectable } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IDeleteByIdUserService } from '../interfaces';
import { UserEntity } from '../domain';

@Injectable()
export class DeleteByIdUserService implements IDeleteByIdUserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async execute(userId: string): Promise<boolean> {
    const user = await this.userRepository.findOne(userId)
     user.update({ deletedAt: new Date() });

    return true;
  }
}
