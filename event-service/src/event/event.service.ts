import { Injectable, Logger } from '@nestjs/common';
// repository 레이어
// import { RefreshTokenMongoose } from 'src/repository/refresh-token.repository';
// import { UserMongoose } from 'src/repository/user.repository';
// 타입정보
// import { JwtPayload, LoginDto, LoginResponse, RefreshDto, RefreshResponse, RegisterDto, UpdateRoleDto, UserResponse } from './dto/user.dto';

@Injectable()
export class EventService {

  private readonly logger = new Logger(EventService.name);
  constructor(
    // private readonly userRepository: UserMongoose,
    // private readonly refreshTokenRepository: RefreshTokenMongoose,
  ) {}

  async eventAdd(): Promise<void> {
  }

  async eventSearch(): Promise<void> {
  }

  async eventDetail(): Promise<void> {
  }

  async rewardAdd(): Promise<void> {
  }

  async rewardSearch(): Promise<void> {
  }
}
