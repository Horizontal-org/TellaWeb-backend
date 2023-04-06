import { forwardRef, Module } from '@nestjs/common';
import { UtilsCommander } from './commander/utils.commander';
import { utilControllers } from './controllers';
import { ConsoleModule } from 'nestjs-console';
import { mailUtilServiceProvider, servicesUtilsProviders } from './utils.providers';

@Module({
  imports: [
    ConsoleModule
  ],
  controllers: [...utilControllers],
  providers: [
    UtilsCommander,
    ...servicesUtilsProviders,
  ],
  exports: [
    mailUtilServiceProvider
  ]
})
export class UtilsModule {}
