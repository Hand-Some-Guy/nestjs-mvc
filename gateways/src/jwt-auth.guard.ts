import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// 인증 전략 지정하고 사용하여 사용자의 인증 정보가 전략과 일치하는 지 검사한다.
// TODO : jwt payload 형식 지정 필요 
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}