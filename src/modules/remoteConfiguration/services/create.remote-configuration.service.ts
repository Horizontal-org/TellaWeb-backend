import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';

import { ICreateRemoteConfigurationService } from '../interfaces';
import { RemoteConfigurationEntity } from '../domain';
import { CreateRemoteConfigurationDto } from '../dto';

@Injectable()
export class CreateRemoteConfigurationService
  implements ICreateRemoteConfigurationService {
  constructor(
    @InjectRepository(RemoteConfigurationEntity)
    private readonly remoteConfigurationRepository: Repository<RemoteConfigurationEntity>,
  ) {}

  async execute(
    createRemoteConfigurationDto: CreateRemoteConfigurationDto,
  ): Promise<RemoteConfigurationEntity> {
    const configuration = new RemoteConfigurationEntity();
    configuration.name = createRemoteConfigurationDto.name;
    configuration.applock = createRemoteConfigurationDto.applock;
    configuration.camoflage = createRemoteConfigurationDto.camoflage;
    configuration.apiUrl = createRemoteConfigurationDto.apiUrl;
    configuration.defaultUser = createRemoteConfigurationDto.defaultUser;

    // TODO: Add collision check
    configuration.shortCode = nanoid(8);

    return this.remoteConfigurationRepository.save(configuration);
  }
}
