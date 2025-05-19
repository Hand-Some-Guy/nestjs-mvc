import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// 레이어 정보 
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventMongoose } from 'src/repository/event.repository';
import { RewardMongoose } from 'src/repository/reward.repository';

// 스키마 정보 
import { EventDocument, EventSchema } from '../model/event.schema';
import { RewardDocument, RewardSchema } from '../model/reward.schema';
import { ClaimDocument, ClaimSchema } from '../model/claim.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
        // 컬랙션 스키마 정의 
      { name: EventDocument.name, schema: EventSchema },
      { name: RewardDocument.name, schema: RewardSchema },
      { name: ClaimDocument.name, schema: ClaimSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'your-secret-key'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    })
  ],
  // 의존성 주입 
  controllers: [EventController],
  providers: [EventService, EventMongoose, RewardMongoose],
})
export class EventModule {}