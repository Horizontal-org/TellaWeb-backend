export interface MailParams {
  subject?: string;
  template: string;
  to: string;
}

export interface IMailUtilService {
  send(params: MailParams): void;
}
