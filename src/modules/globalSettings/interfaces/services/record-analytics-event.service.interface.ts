import { AnalyticsEventDto } from 'modules/globalSettings/dto/analytics-event.dto';

export interface IRecordAnalyticsEventGlobalSettingService {
  execute(dto: AnalyticsEventDto): Promise<void>;
}
