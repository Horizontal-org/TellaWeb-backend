import { TYPES } from './interfaces/types';
import { ValidateAuthService } from './services/validate.auth.service';

export const validateAuthServiceProvider = {
  provide: TYPES.services.IValidateAuthService,
  useClass: ValidateAuthService,
};
