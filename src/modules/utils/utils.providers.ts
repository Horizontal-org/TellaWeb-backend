import { TYPES } from './interfaces/types';
import { MailUtilService } from './services/mail.util.service';

export const mailUtilServiceProvider = {
  provide: TYPES.services.IMailUtilService,
  useClass: MailUtilService,
};

export const servicesUtilsProviders = [
  mailUtilServiceProvider,  
];
