import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbilityFactory, Actions } from 'casl/casl-ability.factory';
import { Repository } from 'typeorm';
import { IUpdateGlobalSettingService } from '../interfaces';
import { GlobalSettingEntity } from '../domain';
import { UpdateGlobalSettingDto } from '../dto/update.global-settings.dto';
import { NotFoundUserException } from 'modules/user/exceptions';

@Injectable()
export class UpdateGlobalSettingService implements IUpdateGlobalSettingService {
  constructor(
    @InjectRepository(GlobalSettingEntity)
    private readonly globalSettingRepository: Repository<GlobalSettingEntity>,

  ) {}

  async execute(id: string, enabled: boolean): Promise<void> {
    const globalSetting = await this.globalSettingRepository.findOne(id);
    
    if (!globalSetting) throw new NotFoundUserException();


    globalSetting.enabled = enabled
    await this.globalSettingRepository.save(globalSetting);

    return;
  }
}
