import { Inject, Injectable } from '@nestjs/common';
import { RemoteConfigurationEntity } from '../domain';
import {
  IGetByShortCodeRemoteConfigurationApplication,
  IGetByShortCodeRemoteConfigurationService,
  TYPES,
} from '../interfaces';

@Injectable()
export class GetByShortCodeRemoteConfigurationApplication
  implements IGetByShortCodeRemoteConfigurationApplication {
  constructor(
    @Inject(TYPES.services.IGetByShortCodeRemoteConfigurationService)
    private getByShortCodeService: IGetByShortCodeRemoteConfigurationService,
  ) {}
  async execute(shortCode: string): Promise<RemoteConfigurationEntity> {
    const configuration = await this.getByShortCodeService.execute(shortCode);
    return configuration;
  }
}
