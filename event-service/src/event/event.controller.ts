import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EventService } from './event.service';
import { EventAddDto, EventSearchDto, RewardAddDto, RewardSearchDto } from './dto/event.dto';

@Controller()
export class EventController {
  private readonly logger = new Logger(EventController.name);

  constructor(private readonly eventService: EventService) {}

  @MessagePattern({ cmd: 'eventAdd' })
  async eventAdd(data: EventAddDto) {
    this.logger.log(`EventAdd called with title: ${data.title}`);
    return this.eventService.eventAdd(
      data.title,
      data.rid,
      data.dateAdded,
      data.dateStart,
      data.duration,
      data.state
    );
  }

  @MessagePattern({ cmd: 'eventSearch' })
  async eventSearch() {
    this.logger.log(`EventSearch called with eid: `);
    return this.eventService.eventSearch();
  }

  @MessagePattern({ cmd: 'eventDetail' })
  async eventDetail(data: EventSearchDto) {
    this.logger.log(`EventDetail called with eid: ${data.eid}`);
    return this.eventService.eventDetail(data.eid);
  }

  @MessagePattern({ cmd: 'rewardAdd' })
  async rewardAdd(data: RewardAddDto) {
    this.logger.log(`RewardAdd called with eid: ${data.eid}`);
    return this.eventService.rewardAdd(data.eid, data.items, data.amount, data.condition);
  }

  @MessagePattern({ cmd: 'rewardRequest' })
  async rewardRequest(data: { uid: string, rid: string, eid: string }) {
    this.logger.log(`RewardSearch called with rid: ${data.rid}`);
    return this.eventService.rewardRequest(data.uid, data.rid, data.eid);
  }

  
   
}