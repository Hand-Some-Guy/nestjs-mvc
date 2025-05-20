import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityHistory } from 'src/model/activity-history.aggregate';
import { ActivityHistoryDocument } from 'src/model/activity-history.schema';
import { ActivityHistoryMapper } from './mapper/activity-history.mapper';

interface ActivityHistoryRepository {
  create(uid: string, type: string, date: Date, time: string): Promise<ActivityHistory>;
  getAll(): Promise<ActivityHistory[]>;
  findById(uid: string): Promise<ActivityHistory | null>;
}

@Injectable()
export class ActivityHistoryMongoose implements ActivityHistoryRepository {
  constructor(
    @InjectModel(ActivityHistoryDocument.name) private activityHistoryModel: Model<ActivityHistoryDocument>,
  ) {}

  async create(uid: string, type: string, date: Date, time: string): Promise<ActivityHistory> {
    const historyDoc = new this.activityHistoryModel({ uid, type, date, time });
    const hisotry = await historyDoc.save();
    return ActivityHistoryMapper.toDomain(hisotry);
  }

  async getAll(): Promise<ActivityHistory[]> {
    const historyDoc = await this.activityHistoryModel.find().exec();
    return historyDoc.map(ActivityHistoryMapper.toDomain);
  }

  async findById(uid: string): Promise<ActivityHistory | null> {
    const historyDoc = await this.activityHistoryModel.findOne({ uid }).exec();
    return historyDoc ? ActivityHistoryMapper.toDomain(historyDoc) : null;
  }

  async countByType(uid: string): Promise<{ [key: string]: number }> {
    const result = await this.activityHistoryModel
      .aggregate([
        {
          $match: { uid }, // uid로 필터링
        },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            type: '$_id',
            count: 1,
          },
        },
      ])
      .exec();

    if (!result || result.length === 0) {
      throw new NotFoundException(`No activity history found for uid: ${uid}`);
    }

    const counts: { [key: string]: number } = {};
    result.forEach((item) => {
      counts[item.type] = item.count;
    });
    return counts;
  }
}