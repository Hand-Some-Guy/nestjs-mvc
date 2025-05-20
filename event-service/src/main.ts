import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const tempApp = await NestFactory.create(AppModule);
  const configService = tempApp.get(ConfigService);

  const rabbitMqUrl = configService.get<string>('RABBITMQ_URL', 'amqp://rabbitmq:5672');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: 'event_queue',
        queueOptions: { durable: false },
      },
    },
  );

  await app.listen();

  await tempApp.close();
}

bootstrap();