import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from 'nestjs-console';
import { ReportsModule } from 'reports/reports.module';
import { ConsoleUserController } from './controllers/console.user.controller';
import { UserReport } from './domain/user-report.entity';
import { User } from './domain/user.entity';
import {
  createUserApplicationProvider,
  createUserServiceProvider,
  findByUernameUserServiceProvider,
  findByUsernameUserApplicationProvider,
  listUserApplicationProvider,
  listUserServiceProvider,
  rolesUserGuardProvider,
  setRoleUserServiceProvider,
  toggleRoleByUsernameUserApplicationProvider,
} from './user.providers';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserReport]),
    ConsoleModule,
    ReportsModule,
  ],
  controllers: [ConsoleUserController],
  providers: [
    rolesUserGuardProvider,
    findByUsernameUserApplicationProvider,
    toggleRoleByUsernameUserApplicationProvider,
    listUserApplicationProvider,
    createUserApplicationProvider,
    listUserServiceProvider,
    findByUernameUserServiceProvider,
    setRoleUserServiceProvider,
    createUserServiceProvider,
  ],
  exports: [findByUsernameUserApplicationProvider],
})
export class UserModule {}
