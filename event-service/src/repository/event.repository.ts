import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { Event } from "src/model/event.aggregate";
import { EventDocument } from '../model/event.schema';
import { EventMapper } from './mapper/event.mapper';

interface EventRepository {
  create(
    rid: string | null,
    title: string,
    dateAdded: Date,
    dateStart: Date,
    duration: number,
  ): Promise<Event>;
  getAll(): Promise<Event[]>;
  findById(eid: string): Promise<Event | null>;
  updateReward(eid: string, rid: string): Promise<void>;
//   update(eid: string, data: Partial<Event>): Promise<void>;
  delete(eid: string): Promise<void>;
}

@Injectable()
export class EventMongoose implements EventRepository {
  constructor(
    @InjectModel(EventDocument.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(
    rid: string | null,
    title: string,
    dateAdded: Date,
    dateStart: Date,
    duration: number,
  ): Promise<Event> {
    const eventDoc = new this.eventModel({
      rid,
      title,
      dateAdded,
      dateStart,
      duration,
    });
    const savedEvent = await eventDoc.save();
    return EventMapper.toDomain(savedEvent);
  }

  async getAll(): Promise<Event[]> {
    const events = await this.eventModel.find().exec();
    return events.map(EventMapper.toDomain);
  }

  async findById(eid: string): Promise<Event | null> {
    const event = await this.eventModel.findById(eid).exec();
    return event ? EventMapper.toDomain(event) : null;
  }

  async updateReward(eid: string, rid: string): Promise<void> {
    await this.eventModel.updateOne({ _id: eid }, { rid }).exec();
  }

//   async update(eid: string, data: Partial<Event>): Promise<void> {
//     await this.eventModel.updateOne({ _id: eid }, EventMapper.toPersistence(data)).exec();
//   }

  async delete(eid: string): Promise<void> {
    await this.eventModel.deleteOne({ _id: eid }).exec();
  }
}