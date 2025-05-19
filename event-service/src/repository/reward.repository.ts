import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { Reward } from "src/model/reward.aggregate";
import { RewardDocument } from '../model/reward.schema';
import { RewardMapper } from './mapper/reward.mapper';

interface RewardRepository {
    create( 
        rid: string, 
        eid: string, 
        items: string[], 
        amount: number[], 
        conditon: string[]
    ): Promise<Reward>;

    getAll(): Promise<Reward[]>;

    findById(rid: string): Promise<Reward>;
    
    update(rid: string): Promise<void>;

    delete(rid: string): Promise<void>;
}

@Injectable()
export class RewardMongoose implements RewardRepository{

    constructor(
        @InjectModel(RewardDocument.name) private rewardModel: Model<RewardDocument>,
    ){}

    async create(
        rid: string, 
        eid: string, 
        items: string[],
        amount: number[], 
        conditon: string[]
    ): Promise<Reward> {
        const rewardDoc = new this.rewardModel({ 
                eid: eid,
                rid: rid,
                items: items,
                amount: amount,
                conditon: conditon
            });
        const saveReward = await rewardDoc.save()

        return RewardMapper.toDomain(saveReward)
    }

    async getAll(): Promise<Reward[]> {
        const rewardsDoc = await this.rewardModel.find().exec()
        return rewardsDoc.map(RewardMapper.toDomain)
    }

    async findById(rid: string): Promise<Reward> {
        const rewardsDoc = await this.rewardModel.findOne({ _id: rid }).exec()
        return rewardsDoc? RewardMapper.toDomain(rewardsDoc) : null
    }

    update(rid: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    delete(rid: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    
    
}