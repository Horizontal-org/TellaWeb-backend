import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { GlobalSettingEntity } from '../domain';
import { IGetByNameGlobalSettingService, IListGlobalSettingService } from '../interfaces';
import { plainToClass } from 'class-transformer';
import { ReadGlobalSettingDto } from '../dto/read.global-setting.dto';
import { NotFoundError } from 'rxjs';
import { NotFoundGlobalSettingException } from 'modules/user/exceptions';

@Injectable()
export class GetByNameGlobalSettingService implements IGetByNameGlobalSettingService {
  constructor(
    @InjectRepository(GlobalSettingEntity)
    private readonly globalSettingsRepo: Repository<GlobalSettingEntity>,
  ) {}

  async execute(name: string): Promise<ReadGlobalSettingDto> {
    const gSetting = await this.globalSettingsRepo.findOne({
      where: { name: name }
    });
   
    if (!gSetting) throw new NotFoundGlobalSettingException();
    
    return plainToClass(ReadGlobalSettingDto, gSetting)
  }
}
