import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IGetByIdRemoteConfigurationService } from 'modules/remoteConfiguration/interfaces/service/get-by-id.remote-configuration.service.interface';
import { RemoteConfigurationEntity } from 'modules/remoteConfiguration/domain/remote-configuration.entity';

@Injectable()
export class GetByIdRemoteConfigService implements IGetByIdRemoteConfigurationService {
  constructor(
    @InjectRepository(RemoteConfigurationEntity)
    private configRepository: Repository<RemoteConfigurationEntity>,
  ) {}

  async execute(reportId: string): Promise<RemoteConfigurationEntity> {
    return this.configRepository.findOne(reportId);
  }
}
