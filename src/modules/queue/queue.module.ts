import { BullModule } from "@nestjs/bull";
import { Global, Module } from "@nestjs/common";
import { UtilsModule } from "modules/utils/utils.module";
import { EmailsProcessor } from "./processors/emails.processor";

@Global()
@Module({
  imports: [    
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
        password: process.env.REDIS_PASSWORD
      },
    }),
    BullModule.registerQueue({
      name: 'emails'
    }),
    UtilsModule
  ],
  providers: [
    EmailsProcessor
  ],
  exports: [
    BullModule,
  ]
})
export class QueueModule {}
