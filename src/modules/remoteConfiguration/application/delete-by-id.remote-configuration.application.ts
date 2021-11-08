import { Inject, Injectable } from '@nestjs/common';

import { NotFoundRemoteConfigurationException } from '../exceptions';
import {
  TYPES,
  IDeleteByIdRemoteConfigurationService,
  IDeleteByIdRemoteConfigurationApplication,
} from '../interfaces';

@Injectable()
export class DeleteByIdRemoteConfigurationApplication
  implements IDeleteByIdRemoteConfigurationApplication {
  constructor(
    @Inject(TYPES.services.IDeleteByIdRemoteConfigurationService)
    private deleteByIdRemoteConfigurationService: IDeleteByIdRemoteConfigurationService,
  ) {}

  async execute(configurationId: string): Promise<boolean> {
    const deleted = await this.deleteByIdRemoteConfigurationService.execute(
      configurationId,
    );
    if (!deleted)
      throw new NotFoundRemoteConfigurationException(configurationId);
    return deleted;
  }
}
