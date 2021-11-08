import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IDeleteByIdRemoteConfigurationService } from '../interfaces';
import { RemoteConfigurationEntity } from '../domain';

@Injectable()
export class DeleteByIdRemoteConfigurationService
  implements IDeleteByIdRemoteConfigurationService {
  constructor(
    @InjectRepository(RemoteConfigurationEntity)
    private remoteConfigurationRepository: Repository<RemoteConfigurationEntity>,
  ) {}

  async execute(configurationId: string): Promise<boolean> {
    const { affected } = await this.remoteConfigurationRepository.delete({
      id: configurationId,
    });
    const isDeleted = affected > 0;
    return isDeleted;
  }
}
