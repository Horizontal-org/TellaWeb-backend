import { BullModule } from "@nestjs/bull";
import { Global, Module } from "@nestjs/common";
import { UtilsModule } from "modules/utils/utils.module";
import { EmailsProcessor } from "./processors/emails.processor";
import { BackupsProcessor } from "./processors/backup.processor";
import { BackupModule } from "modules/backup/backup.module";

@Global()
@Module({
  imports: [    
    BullModule.forRoot({
      redis: {
        // Watch out with this because if it's wrong there is no error
        host: process.env.REDIS_HOST || 'redis',
        port: 6379,
        password: process.env.REDIS_PASSWORD
      },
    }),
    BullModule.registerQueue(
      { name: 'emails' },
      { name: 'backups' }
    ),
    UtilsModule,
    BackupModule
  ],
  providers: [
    EmailsProcessor,
    BackupsProcessor
  ],
  exports: [
    BullModule,
  ]
})
export class QueueModule {}
