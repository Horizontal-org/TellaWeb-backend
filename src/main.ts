import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.useGlobalInterceptors(new TransformInterceptor()).listen(3000);
}
bootstrap();
