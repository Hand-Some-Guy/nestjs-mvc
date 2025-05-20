import { Injectable, Logger, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { EventMongoose } from '../repository/event.repository';
import { RewardMongoose } from '../repository/reward.repository';
import { ClaimMongoose } from '../repository/claim.repository';
import { ClaimResponse, EventResponse, EventState, RewardResponse } from './dto/event.dto';
import { Claim } from 'src/model/claim.aggregate';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    private readonly eventMongoose: EventMongoose,
    private readonly rewardMongoose: RewardMongoose,
    private readonly claimMongoose: ClaimMongoose,
    @Inject('AUTH_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async eventAdd(
    title: string,
    rid: string | null,
    dateAdded: string,
    dateStart: string,
    duration: number,
    state: EventState,
    condition: string[],
    conditionNum: number[],
    conditionType: string[],
  ): Promise<EventResponse> {
    try {
      if (!title || !dateAdded || !dateStart || duration <= 0) {
        throw new BadRequestException('Invalid event data');
      }
      if (condition.length !== conditionNum.length || condition.length !== conditionType.length) {
        throw new BadRequestException('Condition arrays must have equal length');
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
        state,
        condition,
        conditionNum,
        conditionType,
      );

      this.logger.log(`Event added with title: ${title}`);
      return {
        eid: newEvent.getEid(),
        title: newEvent.getTitle(),
        rid: newEvent.getRid(),
        dateAdded: newEvent.getDateAdded().toISOString(),
        dateStart: newEvent.getDateStart().toISOString(),
        duration: newEvent.getDuration(),
        condition: newEvent.getCondition(),
        conditionNum: newEvent.getConditionNum(),
        conditionType: newEvent.getConditionType(),
      };
    } catch (error) {
      this.logger.error(`Event add failed: ${error.message}`);
      throw error;
    }
  }

  async eventSearch(): Promise<EventResponse[]> {
    try {
      const events = await this.eventMongoose.getAll();
      if (!events || events.length === 0) {
        throw new NotFoundException('No events found');
      }

      const result = events.map((event) => ({
        eid: event.getEid(),
        title: event.getTitle(),
        rid: event.getRid(),
        dateAdded: event.getDateAdded().toISOString(),
        dateStart: event.getDateStart().toISOString(),
        duration: event.getDuration(),
        condition: event.getCondition(),
        conditionNum: event.getConditionNum(),
        conditionType: event.getConditionType(),
      }));

      this.logger.log(`Retrieved ${result.length} events`);
      return result;
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
          condition: event.getCondition(),
          conditionNum: event.getConditionNum(),
          conditionType: event.getConditionType(),
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
        condition: event.getCondition(),
        conditionNum: event.getConditionNum(),
        conditionType: event.getConditionType(),
      };
    } catch (error) {
      this.logger.error(`Event update failed: ${error.message}`);
      throw error;
    }
  }

  async rewardAdd(eid: string, items: string[], amount: number[]): Promise<RewardResponse> {
    try {
      if (!eid || !items.length || !amount.length || items.length !== amount.length) {
        throw new BadRequestException('Invalid reward data');
      }

      const event = await this.eventMongoose.findById(eid);
      if (!event) {
        throw new NotFoundException(`Event not found with eid: ${eid}`);
      }

      const reward = await this.rewardMongoose.create(eid, items, amount);

      this.logger.log(`Reward added for eid: ${eid}`);
      await this.eventMongoose.updateReward(eid, reward.getRid());

      return {
        rid: reward.getRid(),
        eid: reward.getEid(),
        items: reward.getItems(),
        amount: reward.getAmount(),
      };
    } catch (error) {
      this.logger.error(`Reward add failed: ${error.message}`);
      throw error;
    }
  }

  async rewardSearch(rid: string): Promise<RewardResponse

> {
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
      };
    } catch (error) {
      this.logger.error(`Reward search failed: ${error.message}`);
      throw error;
    }
  }

  async rewardRequest(uid: string, rid: string, eid: string): Promise<ClaimResponse> {
    try {
      // 활동 기록 집계 
      this.logger.log(`Checking user existence for uid: ${uid}`);
      const activeCnt = await lastValueFrom(
        this.userClient.send({ cmd: 'activeTypeCnt' }, { uid: uid }),
      );

      const event = await this.eventMongoose.findById(eid);
      if (!event) {
        throw new NotFoundException(`Event not found with eid: ${eid}`);
      }

      const reward = await this.rewardMongoose.findById(rid);
      if (!reward) {
        throw new NotFoundException(`Reward not found with rid: ${rid}`);
      }

      // 이벤트 활성화 여부 검사
      if (event.getState() !== 'ACTIVE') {
        throw new BadRequestException('Event is not active');
      }

      // 이벤트 기간 확인
      const now = new Date();
      const eventStart = event.getDateStart();
      const eventEnd = new Date(eventStart.getTime() + event.getDuration() * 24 * 60 * 60 * 1000);
      if (now < eventStart || now > eventEnd) {
        throw new BadRequestException('Event is not within active period');
      }

      // 보상 조건 확인
      const conditions = event.getCondition();
      const conditionNums = event.getConditionNum();
      const conditionTypes = event.getConditionType();
      // TODO: 실제 조건 확인 로직 (예: 사용자 데이터 기반)
      const conditionsMet = true; // Placeholder
      if (!conditionsMet) {
        throw new BadRequestException('Event conditions not met');
      }

      // 중복 지급 방지
      const existingClaim = await this.claimMongoose.findByUserAndEvent(uid, eid);
      if (existingClaim && existingClaim.getState() === 'awarded') {
        throw new BadRequestException('Reward already claimed');
      }

      // 보상 지급 및 이력 저장
      const claim = await this.claimMongoose.create(uid, rid, eid, 'awarded');
      this.logger.log(`Reward requested for uid: ${uid}, rid: ${rid}, eid: ${eid}`);

      return {
        cid: claim.getCid(),
        uid: claim.getUid(),
        rid: claim.getRid(),
        eid: claim.getEid(),
        state: claim.getState(),
        awardedAt: claim.getAwardedAt().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Reward request failed: ${error.message}`);
      await this.claimMongoose.create(uid, rid, eid, 'failed').catch(err => {
        this.logger.error(`Failed to save claim failure: ${err.message}`);
      });
      throw error;
    }
  }

  async claimSearchByFilter(id: string, filterType: 'uid' | 'eid' | 'rid'): Promise<ClaimResponse[]> {
    try {
      if (!filterType || !['uid', 'eid', 'rid'].includes(filterType)) {
        throw new BadRequestException('Invalid filter type');
      }

      let claims: Claim[];
      switch (filterType) {
        case 'uid':
          claims = await this.claimMongoose.findByUser(id);
          break;
        case 'eid':
          claims = await this.claimMongoose.findByEvent(id);
          break;
        default:
          throw new BadRequestException('Invalid filter type');
      }

      if (!claims || claims.length === 0) {
        throw new NotFoundException(`No claims found for ${filterType}: ${id}`);
      }

      this.logger.log(`Claim search for id: ${id}, filterType: ${filterType}`);
      return claims.map(claim => ({
        cid: claim.getCid(),
        uid: claim.getUid(),
        rid: claim.getRid(),
        eid: claim.getEid(),
        state: claim.getState(),
        awardedAt: claim.getAwardedAt().toISOString(),
      }));
    } catch (error) {
      this.logger.error(`Claim search failed: ${error.message}`);
      throw error;
    }
  }
}