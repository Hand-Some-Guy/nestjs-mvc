import { Controller, Post, Get, Body, Inject, UnauthorizedException, UseGuards, Logger, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { LoginDto, RefreshDto, RegisterDto, UpdateRoleDto, EventAddDto, EventSearchDto, RewardAddDto, RewardSearchDto, RewardHistoryDto, RewardRequestDto, ClaimSearchDto } from './dto/app.dto';
import { lastValueFrom } from 'rxjs';

@Controller('api')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('EVENT_SERVICE') private eventClient: ClientProxy,
  ) {}

  @Post('login')
  async login(@Body() data: LoginDto) {
    this.logger.log(`Login request for id: ${data.id}`);
    try {
      return await lastValueFrom(this.authClient.send({ cmd: 'login' }, data));
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw new UnauthorizedException(error.message);
    }
  }

  @Post('refresh')
  async refresh(@Body() data: RefreshDto) {
    this.logger.log(`Refresh request with token: ${data.refreshToken.substring(0, 10)}...`);
    try {
      return await lastValueFrom(this.authClient.send({ cmd: 'refresh' }, data));
    } catch (error) {
      this.logger.error(`Refresh failed: ${error.message}`);
      throw new UnauthorizedException(error.message);
    }
  }

  @Post('register')
  async register(@Body() data: RegisterDto) {
    this.logger.log(`Register request for id: ${data.id}`);
    try {
      return await lastValueFrom(this.authClient.send({ cmd: 'register' }, data));
    } catch (error) {
      this.logger.error(`Register failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('update-role')
  async updateRole(@Body() data: UpdateRoleDto) {
    this.logger.log(`Update role request for id: ${data.id}, role: ${data.role}`);
    try {
      return await lastValueFrom(this.authClient.send({ cmd: 'updateRole' }, data));
    } catch (error) {
      this.logger.error(`Update role failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR','ADMIN')
  @Get('events')
  async getEvents() {
    this.logger.log(`Get all events request`);
    try {
      return await lastValueFrom(this.eventClient.send({ cmd: 'eventSearch' }, {}));
    } catch (error) {
      this.logger.error(`Get events failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR','ADMIN')
  @Post('events')
  async createEvent(@Body() data: EventAddDto) {
    this.logger.log(`Create event request with title: ${data.title}`);
    try {
      return await lastValueFrom(this.eventClient.send({ cmd: 'eventAdd' }, data));
    } catch (error) {
      this.logger.error(`Create event failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @Get('events/:eid')
  async getEventDetail(@Body() data: EventSearchDto) {
    this.logger.log(`Get event detail request for eid: ${data.eid}`);
    try {
      return await lastValueFrom(this.eventClient.send({ cmd: 'eventDetail' }, data));
    } catch (error) {
      this.logger.error(`Get event detail failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('AUDITOR','ADMIN')
  @Post('rewards')
  async addReward(@Body() data: RewardAddDto) {
    this.logger.log(`Add reward request for eid: ${data.eid}`);
    try {
      return await lastValueFrom(this.eventClient.send({ cmd: 'rewardAdd' }, data));
    } catch (error) {
      this.logger.error(`Add reward failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @Get('rewards/:rid')
  async searchReward(@Body() data: RewardSearchDto) {
    this.logger.log(`Search reward request for rid: ${data.rid}`);
    try {
      return await lastValueFrom(this.eventClient.send({ cmd: 'rewardSearch' }, data));
    } catch (error) {
      this.logger.error(`Search reward failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @Post('rewards/request')
  async requestReward(@Body() data: RewardRequestDto) {
    this.logger.log(`Reward request for uid: ${data.uid}, eid: ${data.eid}, rid: ${data.rid}`);
    try {
      return await lastValueFrom(this.eventClient.send({ cmd: 'rewardRequest' }, data));
    } catch (error) {
      this.logger.error(`Reward request failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @Post('claims/search')
  async searchClaims(@Body() data: ClaimSearchDto) {
    this.logger.log(`Claim search request for id: ${data.id}, filterType: ${data.filterType}`);
    try {
      return await lastValueFrom(this.eventClient.send({ cmd: 'claimSearch' }, data));
    } catch (error) {
      this.logger.error(`Claim search failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  
}