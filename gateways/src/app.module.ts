import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'auth_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'EVENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'event_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
    JwtModule.register({
      // 인증키 설정 
      secret: 'your-secret-key',
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [AppController],
  providers: [RolesGuard]
})
export class AppModule {}