import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RemoteConfigurationEntity } from '../domain';
import { NotFoundRemoteConfigurationException } from '../exceptions';
import { IGetByShortCodeRemoteConfigurationService } from '../interfaces';

@Injectable()
export class GetByShortCodeRemoteConfigurationService
  implements IGetByShortCodeRemoteConfigurationService {
  constructor(
    @InjectRepository(RemoteConfigurationEntity)
    private remoteConfigurationRepository: Repository<RemoteConfigurationEntity>,
  ) {}
  async execute(shortCode: string): Promise<RemoteConfigurationEntity> {
    try {
      const configuration = await this.remoteConfigurationRepository.findOneOrFail(
        { shortCode },
      );
      return configuration;
    } catch (_) {
      throw new NotFoundRemoteConfigurationException(shortCode);
    }
  }
}
