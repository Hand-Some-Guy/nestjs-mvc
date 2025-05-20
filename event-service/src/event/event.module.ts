import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// 레이어 정보 
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventMongoose } from 'src/repository/event.repository';
import { RewardMongoose } from 'src/repository/reward.repository';
import { ClaimMongoose } from 'src/repository/claim.repository';

// 스키마 정보 
import { EventDocument, EventSchema } from '../model/event.schema';
import { RewardDocument, RewardSchema } from '../model/reward.schema';
import { ClaimDocument, ClaimSchema } from '../model/claim.schema';

import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: EventDocument.name, schema: EventSchema },
      { name: RewardDocument.name, schema: RewardSchema },
      { name: ClaimDocument.name, schema: ClaimSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL', 'amqp://rabbitmq:5672')],
            queue: 'auth_queue',
            queueOptions: { durable: false },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService, EventMongoose, RewardMongoose, ClaimMongoose],
})
export class EventModule {}