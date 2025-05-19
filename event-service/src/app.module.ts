import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from './event/event.module';

import { ConfigModule, ConfigService } from '@nestjs/config';

// @nestjs/config 테스트 
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI', 'mongodb://mongodb:27017/event-service'),
      }),
      inject: [ConfigService],
    }),
    EventModule,
  ],
})
export class AppModule {}