import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as client from 'prom-client';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Request, Response } from 'express';
import * as Redis from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { INestApplication } from '@nestjs/common';

async function configureRedisAdapter(app: INestApplication) {
  try {
    const url = process.env.REDIS_URL;
    const pubClient = Redis.createClient(url as any);
    const subClient = Redis.createClient(url as any);
    pubClient.on('error', (err) => console.error('Redis pubClient error:', err));
    subClient.on('error', (err) => console.error('Redis subClient error:', err));
    // Connect clients (v3.x connects automatically, but you can call .on('ready'))
    if ((app as any).getIoAdapter) {
      // @ts-ignore
      const ioAdapter = (app as any).getIoAdapter();
      const server = ioAdapter?.getServer();
      if (server && server.adapter) {
        server.adapter(createAdapter(pubClient, subClient));
      }
    }
  } catch (e) {
    console.warn('Could not configure Redis adapter for socket.io', e);
  }
}


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    const config = new DocumentBuilder()
    .setTitle('Bookings Micro-Service')
    .setDescription('API docs for the Bookings microservice')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);


  // Add manual /metrics definition
  document.paths['/metrics'] = {
    get: {
      summary: 'Prometheus metrics endpoint',
      description:
        'Returns the application metrics in Prometheus exposition format.',
      responses: {
        200: {
          description: 'OK',
          content: {
            'text/plain': {
              schema: {
                type: 'string',
                example: '# HELP http_requests_total The total number of HTTP requests\nhttp_requests_total{method="get",code="200"} 1027\n',
              },
            },
          },
        },
      },
    },
  };
  SwaggerModule.setup('api/docs', app, document);

  // configure socket.io redis adapter (best-effort)
  await configureRedisAdapter(app);

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
