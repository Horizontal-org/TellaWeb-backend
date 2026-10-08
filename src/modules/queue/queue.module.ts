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
      // the e2e tests set their own prefix so a running dev server doesn't take their jobs
      ...(process.env.BULL_PREFIX && { prefix: process.env.BULL_PREFIX }),
    }),
    BullModule.registerQueue(
      {
        name: 'emails',
        // retry failed sends (e.g. SMTP down) at ~10s, 20s, 40s, 80s
        defaultJobOptions: {
          attempts: 5,
          backoff: { type: 'exponential', delay: 10000 },
        },
      },
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
