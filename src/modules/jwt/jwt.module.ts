import { BullModule } from "@nestjs/bull";
import { forwardRef, Global, Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { UserModule } from "modules/user/user.module";
import { UtilsModule } from "modules/utils/utils.module";
import { JwtStrategy } from "./strategy/jwt.auth.strategy";

@Global()
@Module({
  imports: [    
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    forwardRef(() => UserModule),
  ],
  providers: [
    JwtStrategy,
  ],
  exports: [
    JwtStrategy,    
    JwtModule
  ]
})
export class GlobalJwtModule {}
