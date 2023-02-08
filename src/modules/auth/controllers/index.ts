import { LoginAuthController } from './login.auth.controller';
import { EnableOtpAuthController } from './enable-otp.auth.controller';
import { VerifyOtpAuthController } from './verify-otp.auth.controller';
import { DisableOtpAuthController } from './disable-otp.auth.controller';
import { ActivateOtpAuthController } from './activate-otp.auth.controller';
import { LoginOtpAuthController } from './login-otp.auth.controller';

export const authControllers = [
  LoginAuthController,
  EnableOtpAuthController,
  VerifyOtpAuthController,
  DisableOtpAuthController,
  ActivateOtpAuthController,
  LoginOtpAuthController
];
