import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from 'nestjs-console';
import { ConfigModule } from '@nestjs/config';

import { OrmConfig } from './ormconfig';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReportModule } from './modules/report/report.module';
import { FileModule } from './modules/file/file.module';
import { RemoteConfigurationModule } from './modules/remoteConfiguration/remote-configuration.module';
import { AbilityModule } from './casl/casl.module';
import { ProjectModule } from 'modules/project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...OrmConfig,
      autoLoadEntities: true,
    }),
    ConsoleModule,
    UserModule,
    FileModule,
    ReportModule,
    AuthModule,
    RemoteConfigurationModule,
    AbilityModule,
    ProjectModule
  ],
})
export class AppModule {}
