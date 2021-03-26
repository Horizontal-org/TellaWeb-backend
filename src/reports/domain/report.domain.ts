import { IsString } from 'class-validator';

export class ReportDomain {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;
}
