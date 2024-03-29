import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as requestIp from 'request-ip'
import { TransformInterceptor } from 'common/interceptors/transform.interceptor';
import { AbilityExceptionFilter } from 'casl/casl-ability.filter';
import { AppModule } from 'app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(requestIp.mw())
  app.enableCors({
    origin: [process.env.WEB_ORIGIN, process.env.APP_ORIGIN],
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tella Web')
    .setDescription('Tella Web API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt',
    )
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  app.useGlobalFilters(new AbilityExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app
    .useGlobalInterceptors(new TransformInterceptor())
    .use(cookieParser())
    .listen(process.env.PORT || 3000);
}
bootstrap();
