import { Global, Module } from '@nestjs/common';
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
import { UtilsModule } from 'modules/utils/utils.module';
import { BullModule } from '@nestjs/bull';
import { QueueModule } from 'modules/queue/queue.module';
import { GlobalJwtModule } from 'modules/jwt/jwt.module';
import { ResourceModule } from 'modules/resource/resource.module';
import { GlobalSettingModule } from 'modules/globalSettings/global-settings.module';
import { BackupModule } from 'modules/backup/backup.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // only used by the login guards; e2e logs in hundreds of times from one IP
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 10 }],
      skipIf: () => process.env.THROTTLE_DISABLED === 'true',
    }),
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
    ProjectModule,
    ResourceModule,
    UtilsModule,
    BackupModule,
    QueueModule,
    GlobalJwtModule,
    GlobalSettingModule,
  ],
})
export class AppModule {}
