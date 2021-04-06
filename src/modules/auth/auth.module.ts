import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from 'modules/user/user.module';

import { BasicStrategy } from './strategy/basic.auth.strategy';

@Module({
  imports: [UserModule, PassportModule],
  providers: [BasicStrategy],
})
export class AuthModule {}
