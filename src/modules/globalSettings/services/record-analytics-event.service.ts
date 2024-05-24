import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GlobalSettingEntity } from '../domain';
import { IRecordAnalyticsEventGlobalSettingService } from '../interfaces/services/record-analytics-event.service.interface';
import { AnalyticsEventDto, CountDivviupEvent, SumDivviupEvent } from '../dto/analytics-event.dto';

@Injectable()
export class RecordAnalyticsEventGlobalSettingService implements IRecordAnalyticsEventGlobalSettingService {
  constructor(
    @InjectRepository(GlobalSettingEntity)
    private readonly globalSettingsRepo: Repository<GlobalSettingEntity>,
  ) {}

  async execute(dto: AnalyticsEventDto): Promise<void> {
    const gSetting = await this.globalSettingsRepo.findOne({
      where: { name: 'DIVVIUP_ANALYTICS' }
    });
   
    if (!gSetting || !gSetting.enabled) {
      console.log('---- ANALYTICS ARE DISABLED ----')
      return
    } 

    if (dto.type === "count") {
      await this.sendCountTasks(dto as CountDivviupEvent)
    }

    if (dto.type === "sum") {
      await this.sendSumTasks(dto as SumDivviupEvent)
    }

    return
  }

  private async sendCountTasks(dto: CountDivviupEvent) {   
    const module = await (eval(`import('@divviup/dap')`) as Promise<any>);
    const task = new module.Task({
      type: 'count',
      id: dto.id,
      leader: "https://dap-09-3.api.divviup.org/",
      helper: "https://helper-dap-09.shira.app/",
      timePrecisionSeconds: 300
    });

    await task.sendMeasurement(dto.measurement); 
    console.log('---- ANALYTICS SENT ---->', dto.id)
  }

  private async sendSumTasks(dto: SumDivviupEvent) {   
    const module = await (eval(`import('@divviup/dap')`) as Promise<any>);
    const task = new module.Task({
      type: 'sum',
      id: dto.id,
      leader: "https://dap-09-3.api.divviup.org/",
      helper: "https://helper-dap-09.shira.app/",
      timePrecisionSeconds: 300,
      bits: 16
    });

    await task.sendMeasurement(dto.measurement); 
    console.log('---- ANALYTICS SENT ----', dto.id)
  }
}