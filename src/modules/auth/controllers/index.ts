import { LoginAuthController } from './login.auth.controller';
import { EnableOtpAuthController } from './enable-otp.auth.controller';
import { VerifyOtpAuthController } from './verify-otp.auth.controller';
import { DisableOtpAuthController } from './disable-otp.auth.controller';
import { ActivateOtpAuthController } from './activate-otp.auth.controller';
import { LoginOtpAuthController } from './login-otp.auth.controller';
import { ValidateRecoveryKeysController } from './validate-recovery-keys.auth.controller';
import { GetRecoveryKeysAuthController } from './get-recovery-keys.auth.controller';
import { LoginRecoveryKeysAuthController } from './login-recovery-keys.auth.controller';
import { LoginWebAuthController } from './login-web.auth.controller';

export const authControllers = [
  LoginWebAuthController,
  LoginAuthController,
  EnableOtpAuthController,
  VerifyOtpAuthController,
  DisableOtpAuthController,
  ActivateOtpAuthController,
  LoginOtpAuthController,
  ValidateRecoveryKeysController,
  GetRecoveryKeysAuthController,
  LoginRecoveryKeysAuthController
];
