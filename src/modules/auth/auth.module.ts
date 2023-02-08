import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from 'modules/user/user.module';
import { authControllers } from './controllers';
import {
  applicationsAuthProviders,
  handlersAuthProviders,
  servicesAuthProviders,
} from './auth.provider';
import { JwtStrategy } from './strategy/jwt.auth.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'modules/user/domain';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [...authControllers],
  providers: [
    ...applicationsAuthProviders,
    ...servicesAuthProviders,
    ...handlersAuthProviders,
    JwtStrategy,
  ],
})
export class AuthModule {}
