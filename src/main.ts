import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as client from 'prom-client';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    const config = new DocumentBuilder()
    .setTitle('Bookings Service')
    .setDescription('API docs for the Bookings microservice')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const register = client.register;
  app.getHttpAdapter().getInstance().get('/metrics', async (req: Request, res: Response) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port);
  console.log(`Listening on ${port}`);
}
bootstrap();
