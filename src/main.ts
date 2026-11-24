import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from 'app.module';
import { configureApp, setupSwagger } from 'app.setup';
import { assertJwtSecret } from 'environment/jwt-secret.environment';

async function bootstrap() {
  assertJwtSecret();

  const app = configureApp(await NestFactory.create(AppModule));
  setupSwagger(app);

  // dev-only upload page (tools/upload.html)
  if (process.env.NODE_ENV !== 'production') {
    app.use('/tools', express.static(join(process.cwd(), 'tools')));
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
