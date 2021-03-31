import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'user/user.module';
import { validateAuthServiceProvider } from './auth.providers';
import { BasicStrategy } from './strategy/basic.auth.strategy';

@Module({
  imports: [UserModule, PassportModule],
  providers: [validateAuthServiceProvider, BasicStrategy],
})
export class AuthModule {}
