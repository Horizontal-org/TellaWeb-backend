import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { UserModule } from 'modules/user/user.module';
import { authControllers } from './controllers';
import {
  applicationsAuthProviders,
  handlersAuthProviders,
  servicesAuthProviders,
} from './auth.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'modules/user/domain';
import { RecoveryKeyEntity } from 'modules/user/domain/recovery-key.entity';
import { UtilsModule } from 'modules/utils/utils.module';
import { GlobalSettingEntity } from 'modules/globalSettings/domain';

@Module({
  imports: [    
    UserModule,
    UtilsModule,
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([RecoveryKeyEntity]),
    TypeOrmModule.forFeature([GlobalSettingEntity]), 
  ],
  controllers: [...authControllers],
  providers: [
    ...applicationsAuthProviders,
    ...servicesAuthProviders,
    ...handlersAuthProviders,
  ],
})
export class AuthModule {}
