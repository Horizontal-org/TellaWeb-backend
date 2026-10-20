import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartialResult } from 'common/dto/partial-result.common.dto';
import { Repository } from 'typeorm';
import { RemoteConfigurationEntity } from '../domain';
import { IListRemoteConfigurationService } from '../interfaces';

@Injectable()
export class ListRemoteConfigurationService implements IListRemoteConfigurationService {
  constructor(
    @InjectRepository(RemoteConfigurationEntity)
    private remoteConfigurationRepository: Repository<RemoteConfigurationEntity>,
  ) {}

  async execute(
    take: number,
    skip: number,
  ): Promise<PartialResult<RemoteConfigurationEntity>> {
    const [configurations, total] = await this.remoteConfigurationRepository
      .createQueryBuilder('remote_configuration')
      // 0 = no limit / no offset, as in TypeORM 0.2 (0.3 sends LIMIT 0 / OFFSET 0)
      .skip(skip || undefined)
      .take(take || undefined)
      .getManyAndCount();

    return {
      total: total,
      results: configurations,
    };
  }
}
