import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { EventMongoose } from '../repository/event.repository';
import { RewardMongoose } from '../repository/reward.repository';
import { EventResponse, RewardResponse } from './dto/event.dto';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    private readonly eventMongoose: EventMongoose,
    private readonly rewardMongoose: RewardMongoose,
    // 보상 조건 확인을 위한 통신 모듈 
    // @Inject('USER_SERVICE') private readonly userClient: ClientProxy;
  ) {}

  async eventAdd(
    title: string,
    rid: string | null,
    dateAdded: string,
    dateStart: string,
    duration: number,
  ): Promise<EventResponse> {
    try {
      if (!title || !dateAdded || !dateStart || duration <= 0) {
        throw new BadRequestException('Invalid event data');
      }
      const dateAddedParsed = new Date(dateAdded);
      const dateStartParsed = new Date(dateStart);
      if (isNaN(dateAddedParsed.getTime()) || isNaN(dateStartParsed.getTime())) {
        throw new BadRequestException('Invalid date format');
      }
      if (dateStartParsed < dateAddedParsed) {
        throw new BadRequestException('Start date must be after added date');
      }

      const newEvent = await this.eventMongoose.create(
        rid,
        title,
        dateAddedParsed,
        dateStartParsed,
        duration,
      );

      this.logger.log(`Event added with title: ${title}`);
      return {
        eid: newEvent.getEid(),
        title: newEvent.getTitle(),
        rid: newEvent.getRid(),
        dateAdded: newEvent.getDateAdded().toISOString(),
        dateStart: newEvent.getDateStart().toISOString(),
        duration: newEvent.getDuration(),
      };
    } catch (error) {
      this.logger.error(`Event add failed: ${error.message}`);
      throw error;
    }
  }

  async eventSearch(eid: string): Promise<EventResponse> {
    try {
      const event = await this.eventMongoose.findById(eid);
      if (!event) {
        throw new NotFoundException(`Event not found with eid: ${eid}`);
      }

      this.logger.log(`Event searched with eid: ${eid}`);
      return {
        eid: event.getEid(),
        title: event.getTitle(),
        rid: event.getRid(),
        dateAdded: event.getDateAdded().toISOString(),
        dateStart: event.getDateStart().toISOString(),
        duration: event.getDuration(),
      };
    } catch (error) {
      this.logger.error(`Event search failed: ${error.message}`);
      throw error;
    }
  }

  async eventDetail(eid: string): Promise<{ event: EventResponse; reward?: RewardResponse }> {
    try {
      const event = await this.eventMongoose.findById(eid);
      if (!event) {
        throw new NotFoundException(`Event not found with eid: ${eid}`);
      }

      let reward: RewardResponse | undefined;
      if (event.getRid()) {
        const rewardEntity = await this.rewardMongoose.findById(event.getRid());
        if (rewardEntity) {
          reward = {
            rid: rewardEntity.getRid(),
            eid: rewardEntity.getEid(),
            items: rewardEntity.getItems(),
            amount: rewardEntity.getAmount(),
            condition: rewardEntity.getCondition(),
          };
        }
      }

      this.logger.log(`Event detail retrieved for eid: ${eid}`);
      return {
        event: {
          eid: event.getEid(),
          title: event.getTitle(),
          rid: event.getRid(),
          dateAdded: event.getDateAdded().toISOString(),
          dateStart: event.getDateStart().toISOString(),
          duration: event.getDuration(),
        },
        reward,
      };
    } catch (error) {
      this.logger.error(`Event detail failed: ${error.message}`);
      throw error;
    }
  }

  async eventUpdate(eid: string, rid: string): Promise<EventResponse> {
    try {
      const event = await this.eventMongoose.findById(eid);
      if (!event) {
        throw new NotFoundException(`Event not found with eid: ${eid}`);
      }

      const reward = await this.rewardMongoose.findById(rid);
      if (!reward) {
        throw new NotFoundException(`Reward not found with rid: ${rid}`);
      }

      await this.eventMongoose.updateReward(eid, rid);

      this.logger.log(`Event updated with eid: ${eid}, rid: ${rid}`);
      return {
        eid: event.getEid(),
        title: event.getTitle(),
        rid,
        dateAdded: event.getDateAdded().toISOString(),
        dateStart: event.getDateStart().toISOString(),
        duration: event.getDuration(),
      };
    } catch (error) {
      this.logger.error(`Event update failed: ${error.message}`);
      throw error;
    }
  }

  async rewardAdd(
    eid: string,
    items: string[],
    amount: number[],
    condition: string[],
  ): Promise<RewardResponse> {
    try {
      if (!eid || !items.length || !amount.length || !condition.length || items.length !== amount.length || items.length !== condition.length) {
        throw new BadRequestException('Invalid reward data');
      }

      const event = await this.eventMongoose.findById(eid);
      if (!event) {
        throw new NotFoundException(`Event not found with eid: ${eid}`);
      }

      const reward = await this.rewardMongoose.create(eid, items, amount, condition);

      this.logger.log(`Reward added for eid: ${eid}`);
      return {
        rid: reward.getRid(),
        eid: reward.getEid(),
        items: reward.getItems(),
        amount: reward.getAmount(),
        condition: reward.getCondition(),
      };
    } catch (error) {
      this.logger.error(`Reward add failed: ${error.message}`);
      throw error;
    }
  }

  async rewardSearch(rid: string): Promise<RewardResponse> {
    try {
      const reward = await this.rewardMongoose.findById(rid);
      if (!reward) {
        throw new NotFoundException(`Reward not found with rid: ${rid}`);
      }

      this.logger.log(`Reward searched with rid: ${rid}`);
      return {
        rid: reward.getRid(),
        eid: reward.getEid(),
        items: reward.getItems(),
        amount: reward.getAmount(),
        condition: reward.getCondition(),
      };
    } catch (error) {
      this.logger.error(`Reward search failed: ${error.message}`);
      throw error;
    }
  }

  async rewardRequest(uid: string, rid: string, eid: string): Promise<void> {
    try {
      // User Service와 통신하여 사용자 확인 (가정)
      // 실제 구현 시 @nestjs/microservices의 ClientProxy 사용
      const userExists = true; // Placeholder
      if (!userExists) {
        throw new NotFoundException(`User not found with uid: ${uid}`);
      }

      const event = await this.eventMongoose.findById(eid);
      if (!event) {
        throw new NotFoundException(`Event not found with eid: ${eid}`);
      }

      const reward = await this.rewardMongoose.findById(rid);
      if (!reward) {
        throw new NotFoundException(`Reward not found with rid: ${rid}`);
      }

      // 보상 지급 이력 확인 
      

      // 보상 조건 확인 (예: 이벤트 기간 여부)
      const now = new Date();
      const eventStart = event.getDateStart();
      const eventEnd = new Date(eventStart.getTime() + event.getDuration() * 24 * 60 * 60 * 1000);
      if (now < eventStart || now > eventEnd) {
        throw new BadRequestException('Event is not active');
      }

      // 보상 지급 로직 (예: 이력 기록, 실제 지급은 별도 서비스 호출)
      this.logger.log(`Reward requested for uid: ${uid}, rid: ${rid}, eid: ${eid}`);
      // TODO: 보상 지급 이력 저장 (별도 컬렉션 또는 서비스 호출)
    } catch (error) {
      this.logger.error(`Reward request failed: ${error.message}`);
      throw error;
    }
  }
}