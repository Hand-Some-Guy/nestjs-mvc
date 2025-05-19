import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EventService } from './event.service';
// import { LoginDto, RefreshDto, RegisterDto, UpdateRoleDto } from './dto/user.dto';

@Controller()
export class EventController {
  private readonly logger = new Logger(EventController.name);

  constructor(private readonly eventService: EventService) {}

  @MessagePattern({ cmd: 'eventAdd' })
  async eventAdd(data :any) {
    // this.logger.log(`Login called with id: ${loginDTO.id} ${loginDTO.password}`);
    return this.eventService.eventAdd();
  }

  @MessagePattern({ cmd: 'eventSearch' })
  async eventSearch(data :any) {
    return this.eventService.eventSearch();
  }

  @MessagePattern({ cmd: 'eventDetail' })
  async eventDetail(data :any) {
    return this.eventService.eventDetail();
  }

  @MessagePattern({ cmd: 'rewardAdd' })
  async rewardAdd(data :any) {
    return this.eventService.rewardAdd(); 
  }

  @MessagePattern({ cmd: 'rewardSearch' })
  async rewardSearch(data :any) {
    return this.eventService.rewardSearch(); 
  }
}