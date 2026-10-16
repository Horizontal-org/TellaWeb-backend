import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { configureApp, setupSwagger } from 'app.setup';
import { assertJwtSecret } from 'environment/jwt-secret.environment';

async function bootstrap() {
  assertJwtSecret();

  const app = configureApp(await NestFactory.create(AppModule));
  setupSwagger(app);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
