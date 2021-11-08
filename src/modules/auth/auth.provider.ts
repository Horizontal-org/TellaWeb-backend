import { TYPES } from './interfaces';
import { ValidateAuthService, GenerateTokenAuthService } from './services';

export const generateTokenAuthServiceProvider = {
  provide: TYPES.services.IGenerateTokenAuthService,
  useClass: GenerateTokenAuthService,
};

export const validateAuthServiceProvider = {
  provide: TYPES.services.IValidateAuthService,
  useClass: ValidateAuthService,
};

export const handlersAuthProviders = [];

export const applicationsAuthProviders = [];

export const servicesAuthProviders = [
  generateTokenAuthServiceProvider,
  validateAuthServiceProvider,
];
