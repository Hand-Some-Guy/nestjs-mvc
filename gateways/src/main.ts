import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// 인증 전략 
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 인증 토큰 획득 비즈니스 로직 
      jwtFromRequest: (req: any) => req.headers.authorization?.replace('Bearer ', ''),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key',
    });
  }

  // 복호화 완료 후 반환할 데이터 
  // TODO : jwt payload 형식 지정 필요 
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();