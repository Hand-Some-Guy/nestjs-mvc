import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Reward } from '../model/reward.aggregate';
import { RewardDocument } from '../model/reward.schema';
import { RewardMapper } from './mapper/reward.mapper';

interface RewardRepository {
  create(eid: string, items: string[], amount: number[]): Promise<Reward>;
  getAll(): Promise<Reward[]>;
  findById(rid: string): Promise<Reward | null>;

}

@Injectable()
export class RewardMongoose implements RewardRepository {
  constructor(
    @InjectModel(RewardDocument.name) private rewardModel: Model<RewardDocument>,
  ) {}

  async create(eid: string, items: string[], amount: number[]): Promise<Reward> {
    const rewardDoc = new this.rewardModel({
      eid,
      items,
      amount,
    });
    const savedReward = await rewardDoc.save();
    return RewardMapper.toDomain(savedReward);
  }

  async getAll(): Promise<Reward[]> {
    const rewardsDoc = await this.rewardModel.find().exec();
    return rewardsDoc.map(RewardMapper.toDomain);
  }

  async findById(rid: string): Promise<Reward | null> {
    const rewardDoc = await this.rewardModel.findById(rid).exec();
    return rewardDoc ? RewardMapper.toDomain(rewardDoc) : null;
  }

  
}