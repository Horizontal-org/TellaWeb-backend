import { OtpAuthHandler } from './handlers/otp.auth.handler';
import { TYPES } from './interfaces';
import { ValidateAuthService, GenerateTokenAuthService, EnableOtpAuthService, VerifyOtpAuthService, ActivateOtpAuthService, CreateRecoveryKeysService } from './services';
import { DisableOtpAuthService } from './services/disable-otp.auth.service';
import { GetRecoveryKeysService } from './services/get.recovery-keys.auth';
import { ValidateRecoveryKeysService } from './services/validate.recovery-keys.auth';

export const generateTokenAuthServiceProvider = {
  provide: TYPES.services.IGenerateTokenAuthService,
  useClass: GenerateTokenAuthService,
};

export const validateAuthServiceProvider = {
  provide: TYPES.services.IValidateAuthService,
  useClass: ValidateAuthService,
};

export const enableOtpAuthServiceProvider = {
  provide: TYPES.services.IEnableOtpAuthService,
  useClass: EnableOtpAuthService
}

export const verifyOtpAuthServiceProvider = {
  provide: TYPES.services.IVerifyOtpAuthService,
  useClass: VerifyOtpAuthService
}

export const disableOtpAuthServiceProvider = {
  provide: TYPES.services.IDisableOtpAuthService,
  useClass: DisableOtpAuthService
}

export const activateOtpAuthServiceProvider = {
  provide: TYPES.services.IActivateOtpAuthService,
  useClass: ActivateOtpAuthService
}

export const createRecoveryKeysServiceProvider = {
  provide: TYPES.services.ICreateRecoveryKeysService,
  useClass: CreateRecoveryKeysService
}

export const validateRecoveryKeysServiceProvider = {
  provide: TYPES.services.IValidateRecoveryKeysService,
  useClass: ValidateRecoveryKeysService
}

export const getRecoveryKeysServiceProvider = {
  provide: TYPES.services.IGetRecoveryKeysService,
  useClass: GetRecoveryKeysService
}
export const otpHandlerProvider = {
  provide: TYPES.handlers.IOtpAuthHandler,
  useClass: OtpAuthHandler
}

export const handlersAuthProviders = [
  otpHandlerProvider
];

export const applicationsAuthProviders = [];

export const servicesAuthProviders = [
  generateTokenAuthServiceProvider,
  validateAuthServiceProvider,
  enableOtpAuthServiceProvider,
  verifyOtpAuthServiceProvider,
  disableOtpAuthServiceProvider,
  activateOtpAuthServiceProvider,
  createRecoveryKeysServiceProvider,
  validateRecoveryKeysServiceProvider,
  getRecoveryKeysServiceProvider
];
