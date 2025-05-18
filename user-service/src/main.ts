import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Create a temporary Nest application to access ConfigService
  const tempApp = await NestFactory.create(AppModule);
  const configService = tempApp.get(ConfigService);

  // Use ConfigService to get RABBITMQ_URL
  const rabbitMqUrl = configService.get<string>('RABBITMQ_URL', 'amqp://rabbitmq:5672');

  // Create the microservice
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: 'auth_queue',
        queueOptions: { durable: false },
      },
    },
  );

  // Start the microservice
  await app.listen();

  // Close the temporary app (optional, depending on your needs)
  await tempApp.close();
}

bootstrap();