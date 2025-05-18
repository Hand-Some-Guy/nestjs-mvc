import { Controller, Post, Get, Body, Inject, UnauthorizedException, UseGuards, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from './jwt-auth.guard';
// role Guard 설정 
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('api')
export class AppController {

  private readonly logger = new Logger(AppController.name);

  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('EVENT_SERVICE') private eventClient: ClientProxy,
  ) {}

  @Post('login')
  async login(@Body() data: { id: string; password: string }) {
    return this.authClient.send({ cmd: 'login' }, data);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    try {
      return await this.authClient.send({ cmd: 'refresh' }, { refreshToken: refreshToken }).toPromise();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  @Post('register')
  async register(@Body() data: { id: string; password: string }) {
    try {
      return await this.authClient.send({ cmd: 'register' }, data).toPromise();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  @Post('updateRole')
  async updateRole(@Body() data: { id: string; role: string }) {
    try {
      return await this.authClient.send({ cmd: 'updateRole' }, data).toPromise();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Get('events')
  async getEvents() {
    return this.eventClient.send({ cmd: 'get_events' }, {});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('events')
  async createEvent(@Body() data: { title: string; date: string }) {
    return this.eventClient.send({ cmd: 'create_event' }, data);
  }
}