import { forwardRef, Module } from '@nestjs/common';
import { UtilsCommander } from './commander/utils.commander';
import { utilControllers } from './controllers';
import { ConsoleModule } from 'nestjs-console';

@Module({
  imports: [
    ConsoleModule
  ],
  controllers: [...utilControllers],
  providers: [
    UtilsCommander
  ]
})
export class UtilsModule {}
