import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from 'modules/user/user.module';
import { authControllers } from './controllers';
import {
  applicationsAuthProviders,
  servicesAuthProviders,
} from './auth.provider';
import { JwtStrategy } from './strategy/jwt.auth.strategy';
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
  ],
  controllers: [...authControllers],
  providers: [
    ...applicationsAuthProviders,
    ...servicesAuthProviders,
    JwtStrategy,
  ],
})
export class AuthModule {}
