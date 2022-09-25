import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      transform: true,
      validateCustomDecorators: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const configSwagger = new DocumentBuilder()
    .setTitle('Point Of Sale Documentation')
    .setDescription('Dokumentasi untuk REST API Point Of Sale')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const configCustomSwagger: SwaggerCustomOptions = {
    swaggerOptions: {
      docExpansion: 'none',
    },
  };

  app.enableCors();

  const doc = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('/api/docs', app, doc, configCustomSwagger);
  await app.listen(3000);
}
bootstrap();
