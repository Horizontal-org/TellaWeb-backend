import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as requestIp from 'request-ip';
import { TransformInterceptor } from 'common/interceptors/transform.interceptor';
import { AbilityExceptionFilter } from 'casl/casl-ability.filter';

// Global middleware, pipes, filters and interceptors. Shared by main.ts and
// the e2e tests, so the tests run the same request pipeline as the server.
export function configureApp(app: INestApplication): INestApplication {
  app.use(requestIp.mw());
  app.enableCors({
    origin: [process.env.WEB_ORIGIN, process.env.APP_ORIGIN],
    credentials: true,
    exposedHeaders: ['Range', 'Content-Range', 'size'],
  });

  app.useGlobalFilters(new AbilityExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  return app
    .useGlobalInterceptors(new TransformInterceptor())
    .use(cookieParser());
}

// Swagger UI at /api, the OpenAPI document at /api-json
export function setupSwagger(app: INestApplication): void {
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
}
