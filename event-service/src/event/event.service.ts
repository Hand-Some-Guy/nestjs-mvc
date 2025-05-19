import { Injectable, Logger } from '@nestjs/common';
// repository 레이어
import { EventMongoose } from 'src/repository/event.repository';
import { RewardMongoose } from 'src/repository/reward.repository';
// 타입정보
// import { JwtPayload, LoginDto, LoginResponse, RefreshDto, RefreshResponse, RegisterDto, UpdateRoleDto, UserResponse } from './dto/user.dto';

@Injectable()
export class EventService {

  private readonly logger = new Logger(EventService.name);
  constructor(
    private readonly eventMongoose: EventMongoose,
    private readonly rewardMongoose: RewardMongoose,
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
