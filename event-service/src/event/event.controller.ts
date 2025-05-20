import { Controller, Logger, BadRequestException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EventService } from './event.service';
import { ClaimSearchDto, EventAddDto, EventSearchDto, RewardAddDto, RewardSearchDto, RewardRequestDto } from './dto/event.dto';

@Controller()
export class EventController {
  private readonly logger = new Logger(EventController.name);

  constructor(private readonly eventService: EventService) {}

  @MessagePattern({ cmd: 'eventAdd' })
  async eventAdd(data: EventAddDto) {
    this.logger.log(`EventAdd called with title: ${data.title}`);
    try {
      return await this.eventService.eventAdd(
        data.title,
        data.rid,
        data.dateAdded,
        data.dateStart,
        data.duration,
        data.state,
        data.condition,
        data.conditionNum,
        data.conditionType,
      );
    } catch (error) {
      this.logger.error(`EventAdd failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  @MessagePattern({ cmd: 'eventSearch' })
  async eventSearch(data: EventSearchDto) {
    this.logger.log(`EventSearch called with eid: ${data.eid || 'all'}`);
    try {
      return await this.eventService.eventSearch();
    } catch (error) {
      this.logger.error(`EventSearch failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  @MessagePattern({ cmd: 'eventDetail' })
  async eventDetail(data: EventSearchDto) {
    this.logger.log(`EventDetail called with eid: ${data.eid}`);
    try {
      return await this.eventService.eventDetail(data.eid);
    } catch (error) {
      this.logger.error(`EventDetail failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  @MessagePattern({ cmd: 'rewardAdd' })
  async rewardAdd(data: RewardAddDto) {
    this.logger.log(`RewardAdd called with eid: ${data.eid}`);
    try {
      return await this.eventService.rewardAdd(data.eid, data.items, data.amount);
    } catch (error) {
      this.logger.error(`RewardAdd failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  @MessagePattern({ cmd: 'rewardRequest' })
  async rewardRequest(data: RewardRequestDto) {
    this.logger.log(`RewardRequest called with uid: ${data.uid}, rid: ${data.rid}`);
    try {
      return await this.eventService.rewardRequest(data.uid, data.rid, data.eid);
    } catch (error) {
      this.logger.error(`RewardRequest failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  @MessagePattern({ cmd: 'claimSearch' })
  async claimSearch(data: ClaimSearchDto) {
    this.logger.log(`ClaimSearch called with id: ${data.id}, filterType: ${data.filterType}`);
    try {
      return await this.eventService.claimSearchByFilter(data.id, data.filterType);
    } catch (error) {
      this.logger.error(`ClaimSearch failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }
}