import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BackupEntity } from './domain';
import { backupControllers } from './controllers';
import {
  servicesBackupProviders,
  applicationsBackupProviders,
  handlersBackupProviders,
  backupsProcessorHandlerProvider
} from './backup.provider';

import { UserEntity } from 'modules/user/domain';
import { GlobalSettingEntity } from 'modules/globalSettings/domain';

@Module({
  imports: [
    TypeOrmModule.forFeature([BackupEntity]), 
    TypeOrmModule.forFeature([UserEntity]),  
    TypeOrmModule.forFeature([GlobalSettingEntity]),  
  ],
  controllers: [...backupControllers],
  providers: [
    ...applicationsBackupProviders, 
    ...servicesBackupProviders,
    ...handlersBackupProviders
  ],
  exports: [backupsProcessorHandlerProvider]
})
export class BackupModule {}
