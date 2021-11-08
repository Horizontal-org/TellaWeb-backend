import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartialResult } from 'common/dto/partial-result.common.dto';
import { Repository } from 'typeorm';
import { RemoteConfigurationEntity } from '../domain';
import { IListRemoteConfigurationService } from '../interfaces';

@Injectable()
export class ListRemoteConfigurationService
  implements IListRemoteConfigurationService {
  constructor(
    @InjectRepository(RemoteConfigurationEntity)
    private remoteConfigurationRepository: Repository<RemoteConfigurationEntity>,
  ) {}

  async execute(
    take: number,
    skip: number,
  ): Promise<PartialResult<RemoteConfigurationEntity>> {
    const [
      configurations,
      total,
    ] = await this.remoteConfigurationRepository
      .createQueryBuilder('remote_configuration')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      total: total,
      results: configurations,
    };
  }
}
