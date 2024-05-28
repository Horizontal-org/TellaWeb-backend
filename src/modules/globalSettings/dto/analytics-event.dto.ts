import { IsString } from 'class-validator';

export class AnalyticsEventDto {
  id: string;
  
  timePrecision: number;

  type: "count" | "sum"

  measurement: boolean | number;
}


export class CountDivviupEvent extends AnalyticsEventDto {

  measurement: boolean;
}

export class SumDivviupEvent extends AnalyticsEventDto {

  measurement: number;

}