import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserDocument, UserSchema } from '../model/user.schema';
import { RefreshTokenDocument, RefreshTokenSchema } from '../model/refresh-token.schema';
import { RefreshTokenMongoose } from 'src/repository/refresh-token.repository';
import { UserMongoose } from 'src/repository/user.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ActivityHistoryDocument, ActivityHistorySchema } from 'src/model/activity-history.schema';
import { ActivityHistoryMongoose } from 'src/repository/activity-history.repository';

// @nestjs/config 테스트 
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
      { name: RefreshTokenDocument.name, schema: RefreshTokenSchema },
      { name: ActivityHistoryDocument.name, schema: ActivityHistorySchema },
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
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenMongoose, UserMongoose, ActivityHistoryMongoose],
})
export class AuthModule {}